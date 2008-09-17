//
//  AdvancedMergeController.m
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "AdvancedMergeController.h"
#import "PDFPage_Extensions.h"
#import "IKBrowserItem.h"
#import "ImportPagesController.h"
#import "PDFImportedPage.h"

#define MyPrivateTableViewDataType @"MyPrivateTableViewDataType"

@implementation AdvancedMergeController

@synthesize advancedWorkflow;

- (void) awakeFromNib {
	//_ik_imagesItems = [[NSMutableArray alloc] init];
	
	[ik_pdfPagesList setDelegate: self];
	[ik_pdfPagesList setDataSource: self];

	[ik_pdfPagesList setAllowsReordering:YES];
	[ik_pdfPagesList setAnimates:YES];
	[ik_pdfPagesList setDraggingDestinationDelegate: self];

	[ik_pdfPagesList setCellsStyleMask: (IKCellsStyleOutlined | IKCellsStyleTitled | IKCellsStyleSubtitled)];
	
	
	[table_detailList setDelegate: self];
	[table_detailList setDataSource: self];
	[table_detailList registerForDraggedTypes: [NSArray arrayWithObject:MyPrivateTableViewDataType]];
	[table_detailList setDoubleAction: @selector(_doubleClickPage:)];
	[table_detailList setTarget:self];

	[slid_zoomSlider setDoubleValue: [ik_pdfPagesList zoomValue]];
}

- (void) _doubleClickPage:(id) sender {
	int sel = [table_detailList selectedRow];
	if (sel > -1) {
		NSString *_url = nil;
		PDFRawPage *page = [advancedWorkflow getPageAtIndex: sel];
		switch (page.ass_pageType) {
			case PDFPage_Type_PageContainer:
				_url = ((PDFMergerDocument*)((PDFPageContainer*)page).ass_document).ass_absolutePath;
				break;
			case PDFPage_Type_ImportedPage:
				_url = ((PDFImportedPage*)page).ass_originalDocPath;
				break;
			default:
				NSBeep();
				break;
		}
		NSLog(@"Open (%d) %@",sel,_url);
		if (_url != nil) [[NSWorkspace sharedWorkspace] openFile: _url];

	}
}

- (void) allocWorkflowForDocumentController:(PDFDocumentsController *) _controller {
	advancedWorkflow = [PDFMergeWorkflow workflowWithDocumentsController: _controller andDelegate: controller_mainWnd];
	[advancedWorkflow resetPagesListOrder];
			
	[ik_pdfPagesList performSelectorOnMainThread: @selector(reloadData) withObject:nil waitUntilDone:NO];
}

- (void)imageBrowser:(IKImageBrowserView*)view removeItemsAtIndexes: (NSIndexSet*)indexes
{
  [advancedWorkflow removePageAtIndex: [indexes firstIndex]];
}

- (BOOL) imageBrowser:(IKImageBrowserView *) aBrowser moveItemsAtIndexes: (NSIndexSet *)indexes toIndex:(NSUInteger)destinationIndex {
  NSInteger    index;
  NSMutableArray*  temporaryArray;

  temporaryArray = [[[NSMutableArray alloc] init] autorelease];

  // First remove items from the data source and keep them in a temporary array.
  for (index = [indexes lastIndex]; index != NSNotFound; index = [indexes indexLessThanIndex:index])
  {
    if (index < destinationIndex)
      destinationIndex --;

    id obj = [advancedWorkflow getPageAtIndex:index];
    [temporaryArray addObject:obj];
    [advancedWorkflow removePageAtIndex:index];
  }

  // Then insert the removed items at the appropriate location.
  NSInteger n = [temporaryArray count];
  for (index = 0; index < n; index++)
  {
    [advancedWorkflow insertPage: [temporaryArray objectAtIndex:index] atIndex:destinationIndex];
  }

  return YES;
}


- (NSUInteger) numberOfItemsInImageBrowser:(IKImageBrowserView *) aBrowser {
	return [advancedWorkflow totalPages];
}

- (id) imageBrowser:(IKImageBrowserView *) aBrowser itemAtIndex:(NSUInteger)index {
	PDFRawPage *page = [advancedWorkflow getPageAtIndex: index];

	return [[IKBrowserItem alloc] initWithPDFRawPage: page 
										 size: [ik_pdfPagesList cellSize].width];
	/*
	IKBrowserItem * obj = nil;
	if (index < [_ik_imagesItems count]) obj = [_ik_imagesItems objectAtIndex: index];
	
	if (obj == nil) [_ik_imagesItems insertObject: [[IKBrowserItem alloc] initWithPDFRawPage: page 
																						size: [ik_pdfPagesList cellSize].width];
										  atIndex: index];
	
	return [_ik_imagesItems objectAtIndex: index];
*/
}


- (void) imageBrowserSelectionDidChange:(IKImageBrowserView *) aBrowser {
	NSIndexSet *selIndexes = [aBrowser selectionIndexes];
	
	if ([selIndexes count] > 1) {


	
	} else {
		[controller_mainWnd.controller_previewWindow loadPreviewFor: 
			[[advancedWorkflow getPageAtIndex: [selIndexes firstIndex]] getPage]];
	
		PDFRawPage *page = [advancedWorkflow getPageAtIndex: [selIndexes firstIndex]];
		[table_detailList scrollRowToVisible: [advancedWorkflow getIndexOfPage: page]];
		[table_detailList selectRow: [advancedWorkflow getIndexOfPage: page] byExtendingSelection: NO];
	}

	
}


- (void) imageBrowser:(IKImageBrowserView *) aBrowser cellWasDoubleClickedAtIndex:(NSUInteger) index {
	
}

// -------------------------------------------------------------------------
//  draggingEntered:sender
// ------------------------------------------------------------------------- 
- (NSDragOperation)draggingEntered:(id <NSDraggingInfo>)sender
{
    return NSDragOperationCopy;
}

// -------------------------------------------------------------------------
//  draggingUpdated:sender
// ------------------------------------------------------------------------- 
- (NSDragOperation)draggingUpdated:(id <NSDraggingInfo>)sender
{
    return NSDragOperationCopy;
}

// -------------------------------------------------------------------------
//  performDragOperation:sender
// ------------------------------------------------------------------------- 
- (BOOL)performDragOperation:(id <NSDraggingInfo>)sender
{
    NSData*      data = nil;
    NSPasteboard*  pasteboard = [sender draggingPasteboard];

  // Look for paths on the pasteboard.
    if ([[pasteboard types] containsObject:NSFilenamesPboardType]) 
        data = [pasteboard dataForType:NSFilenamesPboardType];

    if (data)
  {
    NSString* errorDescription;
    
    // Retrieve  paths.
        NSArray* filenames = [NSPropertyListSerialization propertyListFromData:data 
                mutabilityOption:kCFPropertyListImmutable 
                format:nil 
                errorDescription:&errorDescription];

    // Add paths to the data source.
        NSInteger i, n;
        n = [filenames count];
        for (i = 0; i < n; i++)
    {
           // [self addAnImageWithPath:[filenames objectAtIndex:i]];
        }
    
    // Make the image browser reload the data source.
       [ik_pdfPagesList reloadData];
	   // [self updateDatasource];
    }

  // Accept the drag operation.
  return YES;
}

- (IBAction) btn_changePreviewSizes:(id) sender {
	[ik_pdfPagesList setZoomValue: [sender doubleValue]];
}


- (BOOL)tableView:(NSTableView *)aTableView shouldSelectRow:(int)rowIndex {
	[ik_pdfPagesList setSelectionIndexes: [NSIndexSet indexSetWithIndex: rowIndex] byExtendingSelection: NO];
	[ik_pdfPagesList scrollIndexToVisible: rowIndex];
	return YES;
}

- (PDFDocumentsController *) _documentController {
	return advancedWorkflow.ass_documentController;
}

- (int)numberOfRowsInTableView:(NSTableView *)aTableView {
	return [advancedWorkflow totalPages];
}

- (id)tableView:(NSTableView *)aTableView objectValueForTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	PDFRawPage *page = [advancedWorkflow getPageAtIndex: rowIndex];
	NSString *colId = [aTableColumn identifier];
	
	if ([colId isEqualToString:@"POSITION"])
		return [NSString stringWithFormat: @"%d",rowIndex+1];
	else {
		switch (page.ass_pageType) {
			case PDFPage_Type_PageContainer:
				if ([colId isEqualToString:@"PAGE"]) return [NSString stringWithFormat: @"%d", ((PDFPageContainer*)page).ass_originalDocPageIndex];
				if ([colId isEqualToString:@"DOCUMENT"]) return [NSString stringWithFormat: @"%@",[((PDFPageContainer*)page).ass_document.ass_absolutePath lastPathComponent]];
				break;
			case PDFPage_Type_EmptyPage:
				if ([colId isEqualToString:@"PAGE"]) return [NSString stringWithFormat: @"%d",0];
				if ([colId isEqualToString:@"DOCUMENT"])  return @"Empty Page";
				break;
			case PDFPage_Type_ImportedPage:
				if ([colId isEqualToString:@"PAGE"]) return [NSString stringWithFormat: @"%d", ((PDFImportedPage*)page).ass_originalDocPageIndex];
				if ([colId isEqualToString:@"DOCUMENT"])  return [NSString stringWithFormat: @"Imported (%@)", [((PDFImportedPage*)page).ass_originalDocPath lastPathComponent]];
				break;
		}
	}
	return @"x";
}

- (void)tableView:(NSTableView *)aTableView willDisplayCell:(id)aCell forTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {	
}

- (BOOL)tableView:(NSTableView *)aTableView shouldEditTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	return NO;
}


- (BOOL)tableView:(NSTableView *)tv writeRowsWithIndexes:(NSIndexSet *)rowIndexes toPasteboard:(NSPasteboard*)pboard
{
    // Copy the row numbers to the pasteboard.
    NSData *data = [NSKeyedArchiver archivedDataWithRootObject:rowIndexes];
    [pboard declareTypes:[NSArray arrayWithObject:MyPrivateTableViewDataType] owner:self];
    [pboard setData:data forType:MyPrivateTableViewDataType];
    return YES;
}

- (NSDragOperation)tableView:(NSTableView*)tv validateDrop:(id <NSDraggingInfo>)info proposedRow:(int)row proposedDropOperation:(NSTableViewDropOperation)op
{
    // Add code here to validate the drop
    return NSDragOperationEvery;
}

- (BOOL)tableView:(NSTableView *)aTableView acceptDrop:(id <NSDraggingInfo>)info
			  row:(int)row dropOperation:(NSTableViewDropOperation)operation
{
    NSPasteboard* pboard = [info draggingPasteboard];
    NSData* rowData = [pboard dataForType:MyPrivateTableViewDataType];
    NSIndexSet* rowIndexes = [NSKeyedUnarchiver unarchiveObjectWithData:rowData];
   // int dragRow = [rowIndexes firstIndex];
	
//	[[_ik_imagesItems objectsAtIndexes: rowIndexes] makeObjectsPerformSelector: @selector(clearThumbnailCache)];
	
	//[_ik_imagesItems removeAllObjects];
	
    // Move the specified row to its new location...
	[advancedWorkflow movePagesAtIndexes: rowIndexes afterPage: [advancedWorkflow getPageAtIndex: row]];
		
	[table_detailList reloadData];
	[ik_pdfPagesList reloadData];
	return YES;
}

- (PDFRawPage *) selectedPage {
	if ([table_detailList selectedRow] > -1) return [advancedWorkflow getPageAtIndex: [table_detailList selectedRow]];
	return nil;
}


- (void) btn_addEmptyPage {
	if ([table_detailList selectedRow] > -1) {
		[NSApp beginSheet: window_emptyPageSetup 
		   modalForWindow: window_mainWindow
			modalDelegate:self 
		   didEndSelector:NULL 
			  contextInfo:nil];
		
	}
}

- (void) btn_removePage {
	if ([table_detailList selectedRow] > -1) {
		[advancedWorkflow removePageAtIndex: [table_detailList selectedRow]];
		[self _reloadTables];
	}
}

- (void) _reloadTables {
	[table_detailList reloadData];
	[ik_pdfPagesList reloadData];
}

- (void) btn_pairPages {
	NSBeginAlertSheet(@"Pair pages",@"OK",@"Cancel", nil, 
					  window_mainWindow, self, 
					  @selector(pairPagesAdvancedWorkflow:returnCode:contextInfo:), nil, 
					  nil, 
					  @"Pair pages feature will re-arrange workflow with default pages documents; you will lose further customization. Are you sure?");
}

- (void) pairPagesAdvancedWorkflow:(NSOpenPanel *)panel returnCode:(int)returnCode  contextInfo:(void  *)contextInfo {
	int unPairDocs = 0;
	if (returnCode == NSAlertDefaultReturn ) { // OK DISCARD
		[advancedWorkflow resetPagesListOrder];
		int pageLocToAdd = 0;
		for (PDFMergerDocument *cDoc in [self _documentController].ass_listOfOpenedPDFs) {
			pageLocToAdd += [cDoc totalPages];
			
			if ([cDoc totalPages] % 2 != 0) {
				unPairDocs++;
				NSRect size = [ [((PDFImportedPage*)[[cDoc pdfPages] lastObject]) getPage] boundsForBox: kPDFDisplayBoxMediaBox];
				// not pair
				[advancedWorkflow insertBlankPageAtIndex: pageLocToAdd withSize:  size.size];
				pageLocToAdd++;
			}
		}
	//	id alert = NSGetInformationalAlertPanel(@"Pair task completed!", [NSString stringWithFormat: @"Added %d blank pages to pair document",unPairDocs], @"OK", nil, nil);
	//	[[NSApplication sharedApplication] runModalForWindow: alert];//beginSheet:alert modalForWindow:window_mainWindow modalDelegate:self didEndSelector: nil contextInfo:NULL];
		
		[self _reloadTables];
	}
}

- (void) btn_importPages {
	NSOpenPanel	*openPanel = [NSOpenPanel openPanel];
	[openPanel setTitle: @"Select PDF source:"];
	if ([openPanel runModalForDirectory:nil file:nil] == NSOKButton) {
		[controller_importPages loadWithDocumentAtPath: [openPanel filename] toInsertAtIndex: [table_detailList selectedRow]];

	}
}

- (IBAction) btnEmptyPage_OK:(id) sender {
	int k; for (k=0; k < [emptyPage_fld_numberOfPages intValue]; k++) {
		float h = [emptyPage_pop_pagesFormatWidth floatValue]*0.026458333;
		float w = [emptyPage_pop_pagesFormatHeight floatValue]*0.026458333;
		
		[advancedWorkflow insertBlankPageAtIndex: [table_detailList selectedRow]+k withSize: NSMakeSize(w, h)];
	
		[table_detailList reloadData];
		[ik_pdfPagesList reloadData];
	}
}

- (IBAction) btnEmptyPage_Cancel:(id) sender {
	[NSApp endSheet: window_emptyPageSetup];
	[window_emptyPageSetup orderOut:nil];
}


@end
