//
//  SimpleMergeController.m
//  PDFMergeX
//
//  Created by malcom on 10/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "SimpleMergeController.h"


@implementation SimpleMergeController

@synthesize tbl_listedPDFs;



- (void) awakeFromNib {
	[tbl_listedPDFs setDelegate: self];
	[tbl_listedPDFs setDataSource: self];
	[tbl_listedPDFs setTarget: self];
	[tbl_listedPDFs registerForDraggedTypes:[NSArray arrayWithObject:NSFilenamesPboardType]];

}

- (BOOL)tableView:(NSTableView *)aTableView acceptDrop:(id <NSDraggingInfo>)info
			  row:(int)row dropOperation:(NSTableViewDropOperation)operation
{
    NSPasteboard* pboard = [info draggingPasteboard];
	NSArray *fileArray = [pboard propertyListForType:@"NSFilenamesPboardType"];
	[controller_mainWindow.ass_documentController addPDFDocumentsPaths: fileArray];
	[tbl_listedPDFs reloadData];

	return YES;
}

- (NSDragOperation)tableView:(NSTableView*)tv validateDrop:(id <NSDraggingInfo>)info proposedRow:(int)row proposedDropOperation:(NSTableViewDropOperation)op
{
    // Add code here to validate the drop
    return NSDragOperationEvery;
}




- (PDFDocumentsController *) _documentController {
	return controller_mainWindow.ass_documentController;
}

- (BOOL)tableView:(NSTableView *)aTableView shouldSelectRow:(int)rowIndex {
	[controller_mainWindow.controller_previewWindow loadPreviewFor: 
		[((PDFMergerDocument*)[controller_mainWindow.ass_documentController getDocumentAtIndex: rowIndex])
					pdfDocument]];
	return YES;
}

- (int)numberOfRowsInTableView:(NSTableView *)aTableView {
	int tot = [[self _documentController].ass_listOfOpenedPDFs count];
	return tot;
}


- (id)tableView:(NSTableView *)aTableView objectValueForTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	PDFMergerDocument *doc = (PDFMergerDocument*)[[self _documentController].ass_listOfOpenedPDFs objectAtIndex:rowIndex];
	NSString *colId = [aTableColumn identifier];
	
	if ([colId isEqualToString:@"NAME"])
		return [[doc.ass_absolutePath lastPathComponent] stringByDeletingPathExtension];
	
	if ([colId isEqualToString:@"PAGES"])
		return [NSString stringWithFormat: @"%d",[doc totalPages]];
	
	if ([colId isEqualToString:@"PATH"])
		return doc.ass_absolutePath;
	
	return nil;
}

- (void)tableView:(NSTableView *)aTableView willDisplayCell:(id)aCell forTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {	
}

- (BOOL)tableView:(NSTableView *)aTableView shouldEditTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	return YES;
}

- (IBAction) btn_addPDFs:(id) sender {
	NSOpenPanel *open = [NSOpenPanel openPanel];
	[open setAllowsMultipleSelection: YES];
	[open setCanChooseDirectories: NO];
	
	[open beginSheetForDirectory: nil file: nil modalForWindow:ass_mainWindow
									modalDelegate:self didEndSelector:@selector(pdfsSelected:returnCode:contextInfo:)  
									contextInfo:nil];
}

- (void)pdfsSelected:(NSOpenPanel *)panel returnCode:(int)returnCode  contextInfo:(void  *)contextInfo {
	if (returnCode == 1) {
		[controller_mainWindow.ass_documentController addPDFDocumentsPaths: [panel filenames]];
		[tbl_listedPDFs reloadData];
	}
}

- (IBAction) btn_removePDFs:(id) sender {
	if ([tbl_listedPDFs selectedRow] > -1) {
		PDFDocumentsController *controller = controller_mainWindow.ass_documentController;
		[controller removePDFDocument: [controller getDocumentAtIndex: [tbl_listedPDFs selectedRow]]];
		[tbl_listedPDFs reloadData];
	}
}

- (IBAction) btn_moveUp:(id) sender {
	int selRow = [tbl_listedPDFs selectedRow];
	if (selRow > 0) {
		PDFDocumentsController *controller = controller_mainWindow.ass_documentController;
		[controller.ass_listOfOpenedPDFs exchangeObjectAtIndex: selRow withObjectAtIndex: selRow-1];
		[tbl_listedPDFs reloadData];
		[tbl_listedPDFs selectRow: selRow-1 byExtendingSelection:NO];
	}
}

- (IBAction) btn_moveDown:(id) sender {
	PDFDocumentsController *controller = controller_mainWindow.ass_documentController;
	int selRow = [tbl_listedPDFs selectedRow];

	if (selRow < [controller.ass_listOfOpenedPDFs count]-1) {
		[controller.ass_listOfOpenedPDFs exchangeObjectAtIndex: selRow withObjectAtIndex: selRow+1];
		[tbl_listedPDFs reloadData];
		[tbl_listedPDFs selectRow: selRow+1 byExtendingSelection:NO];
	}
}

- (PDFDocument *) selectedDocument {
	if ([tbl_listedPDFs selectedRow] > -1) {
		PDFMergerDocument *doc = (PDFMergerDocument*)[[self _documentController].ass_listOfOpenedPDFs objectAtIndex:[tbl_listedPDFs selectedRow]];
		return [doc pdfDocument];
	} return nil;
}

@end
