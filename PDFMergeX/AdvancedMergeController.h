//
//  AdvancedMergeController.h
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "MainWndController.h"
#import <Quartz/Quartz.h>
#import "PDFMergeWorkflow.h"

@class ImportPagesController;
@class MainWndController;
@interface AdvancedMergeController : NSObject {
	IBOutlet	MainWndController	*controller_mainWnd;
	IBOutlet	ImportPagesController	*controller_importPages;
	
	IBOutlet	IKImageBrowserView	*ik_pdfPagesList;
	IBOutlet	NSSlider			*slid_zoomSlider;
	IBOutlet	NSTableView			*table_detailList;
	IBOutlet	NSWindow			*window_emptyPageSetup;
	IBOutlet	NSWindow			*window_mainWindow;
	
	IBOutlet	NSTextField			*emptyPage_fld_numberOfPages;
	IBOutlet	NSTextField			*emptyPage_pop_pagesFormatWidth;
	IBOutlet	NSTextField			*emptyPage_pop_pagesFormatHeight;

	PDFMergeWorkflow	*advancedWorkflow;

}

@property (assign) PDFMergeWorkflow	*advancedWorkflow;

- (PDFDocumentsController *) _documentController;
- (void) allocWorkflowForDocumentController:(PDFDocumentsController *) _controller;

- (IBAction) btn_changePreviewSizes:(id) sender;
- (PDFRawPage *) selectedPage;

- (void) btn_addEmptyPage;
- (void) btn_removePage;
- (void) btn_importPages;
- (void) btn_pairPages;
- (void) _reloadTables;

- (IBAction) btnEmptyPage_OK:(id) sender;
- (IBAction) btnEmptyPage_Cancel:(id) sender;

@end
