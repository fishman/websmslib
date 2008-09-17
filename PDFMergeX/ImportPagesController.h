//
//  ImportPagesController.h
//  PDFMergeX
//
//  Created by malcom on 8/14/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <PDFKit/PDFKit.h>
#import <Quartz/Quartz.h>

@class AdvancedMergeController;
@interface ImportPagesController : NSObject {
	IBOutlet	NSTextField			*importPgs_documentPath;
	IBOutlet	NSTextField			*importPgs_insertAfterIndex;
	IBOutlet	NSTextField			*importPgs_docPagesStats;
	IBOutlet	NSTableView			*importPgs_pagesTable;
	IBOutlet	NSTableView			*importPgs_insertedPagesTable;

	IBOutlet	NSTextField			*importPgs_totalPages;
	IBOutlet	PDFView				*importPgs_pdfView;
	IBOutlet	NSWindow			*ass_thisWindow;
	IBOutlet	NSWindow			*ass_mainWindow;

	IBOutlet	AdvancedMergeController	*controller_advanceMerge;
	
	int					_currentLoadedPageIdx;
	PDFDocument			*_openedDoc;
	NSMutableArray		*_documentInsertedPages;
	NSString			*_docPath;
}

- (IBAction) btn_movePages:(id) sender;
- (IBAction) btn_OK:(id) sender;
- (IBAction) btn_Cancel:(id) sender;
- (IBAction) btn_addPage:(id) sender;
- (IBAction) btn_removePage:(id) sender;
- (IBAction) btn_Up:(id) sender;
- (IBAction) btn_Down:(id) sender;

- (void) loadWithDocumentAtPath:(NSString *) importDocPath toInsertAtIndex:(int) _index;
- (void) _closeSheet;

@end
