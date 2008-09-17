//
//  ImportPagesController.m
//  PDFMergeX
//
//  Created by malcom on 8/14/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "ImportPagesController.h"
#import "AdvancedMergeController.h"
#import "PDFImportedPage.h"

@implementation ImportPagesController

- (IBAction) btn_movePages:(id) sender {
	
	switch ([sender selectedSegment]) {
		case 0: // back
			if (_currentLoadedPageIdx > 0) {
				_currentLoadedPageIdx--;
				[importPgs_pdfView goToPreviousPage: nil];
			}
			break;
		case 1: // next
			if (_currentLoadedPageIdx < [_openedDoc pageCount]) {
				_currentLoadedPageIdx++;
				[importPgs_pdfView goToNextPage:nil];
			}
			break;
	}
	
	[importPgs_pagesTable scrollRowToVisible: _currentLoadedPageIdx];
	[importPgs_pagesTable selectRow: _currentLoadedPageIdx byExtendingSelection: NO];
	
	[importPgs_docPagesStats setStringValue: [NSString stringWithFormat: @"%d/%d",_currentLoadedPageIdx,[_openedDoc pageCount]-1]];
}

- (IBAction) btn_OK:(id) sender {
	if ([_documentInsertedPages count] > 0) {
		int insertAfter = [importPgs_insertAfterIndex intValue];
		int k; for (k=0; k < [_documentInsertedPages count]; k++) {
			[controller_advanceMerge.advancedWorkflow insertPage: [_documentInsertedPages objectAtIndex: k] atIndex: insertAfter];
			insertAfter++;
		}
		
		[controller_advanceMerge _reloadTables];
		
		[self _closeSheet];
	} else NSBeep();
}

- (IBAction) btn_Cancel:(id) sender {
	[self _closeSheet];
}

- (void) _closeSheet {
	[NSApp endSheet: ass_thisWindow];
	[ass_thisWindow orderOut:nil];	
}

- (void) awakeFromNib {
	[importPgs_pagesTable setDelegate: self];
	[importPgs_pagesTable setDataSource: self];
	[importPgs_pagesTable setDoubleAction: @selector(_doubleClickItem:)];
	[importPgs_pagesTable setTarget:self];

	[importPgs_insertedPagesTable setDelegate: self];
	[importPgs_insertedPagesTable setDataSource: self];
}

- (void) loadWithDocumentAtPath:(NSString *) importDocPath toInsertAtIndex:(int) _index {
	_openedDoc = [[PDFDocument alloc] initWithData: [NSData dataWithContentsOfFile: importDocPath]];
	if (_openedDoc != nil) {
	
		if (_index == -1) _index = [controller_advanceMerge.advancedWorkflow totalPages]-1;
		
		_docPath = importDocPath;
		[importPgs_pdfView setDocument: _openedDoc];
		[importPgs_documentPath setStringValue: [importDocPath lastPathComponent]];
		[importPgs_insertAfterIndex setIntValue: _index];
		[importPgs_totalPages setStringValue: [NSString stringWithFormat: @"%d",[_openedDoc pageCount]]];
		_currentLoadedPageIdx = 0;
		[importPgs_docPagesStats setStringValue: [NSString stringWithFormat: @"%d/%d",_currentLoadedPageIdx,[_openedDoc pageCount]-1]];
		_documentInsertedPages = [[NSMutableArray alloc] init];

		[importPgs_pagesTable reloadData];
		[importPgs_insertedPagesTable reloadData];
		
		[NSApp beginSheet: ass_thisWindow 
			modalForWindow: ass_mainWindow
			modalDelegate:self 
			didEndSelector:NULL 
			  contextInfo:nil];
								
	}
}


- (void) _doubleClickItem:(id) sender {
	[self btn_addPage: nil];
}

- (BOOL)tableView:(NSTableView *)aTableView shouldSelectRow:(int)rowIndex {
	[importPgs_pdfView goToPage: [_openedDoc pageAtIndex: rowIndex]];
	_currentLoadedPageIdx = rowIndex;
	[importPgs_docPagesStats setStringValue: [NSString stringWithFormat: @"%d/%d",_currentLoadedPageIdx,[_openedDoc pageCount]-1]];
	return YES;
}

- (int)numberOfRowsInTableView:(NSTableView *)aTableView {
	if (aTableView == importPgs_pagesTable) return [_openedDoc pageCount];
	else return [_documentInsertedPages count];
}


- (id)tableView:(NSTableView *)aTableView objectValueForTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	if (aTableView == importPgs_pagesTable) {
		return [NSString stringWithFormat: @"%d",rowIndex];
	} else {
		PDFImportedPage *cPage = [_documentInsertedPages objectAtIndex: rowIndex];
		return [NSString stringWithFormat: @"%d", cPage.ass_originalDocPageIndex];
	}
}

- (void)tableView:(NSTableView *)aTableView willDisplayCell:(id)aCell forTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {	
}

- (BOOL)tableView:(NSTableView *)aTableView shouldEditTableColumn:(NSTableColumn *)aTableColumn row:(int)rowIndex {
	return NO;
}
	
	
- (IBAction) btn_addPage:(id) sender {
	if ([importPgs_pagesTable selectedRow] > -1) {
		PDFImportedPage *imp = [[PDFImportedPage alloc] initWithPage: [_openedDoc pageAtIndex: [importPgs_pagesTable selectedRow]] atIndex: [importPgs_pagesTable selectedRow] atPath: _docPath];
		[_documentInsertedPages addObject: imp];
		[importPgs_insertedPagesTable reloadData];
	}
}
	
- (IBAction) btn_removePage:(id) sender {
	if ([importPgs_insertedPagesTable selectedRow] > -1) {
		[_documentInsertedPages removeObjectAtIndex: [importPgs_insertedPagesTable selectedRow]];
		[importPgs_insertedPagesTable reloadData];
	}
}
	
- (IBAction) btn_Up:(id) sender {
	[_documentInsertedPages exchangeObjectAtIndex:[importPgs_insertedPagesTable selectedRow] withObjectAtIndex: [importPgs_insertedPagesTable selectedRow]-1];
}
	
- (IBAction) btn_Down:(id) sender {
	[_documentInsertedPages exchangeObjectAtIndex:[importPgs_insertedPagesTable selectedRow] withObjectAtIndex: [importPgs_insertedPagesTable selectedRow]+1];
}

@end
