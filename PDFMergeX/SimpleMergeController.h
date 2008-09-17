//
//  SimpleMergeController.h
//  PDFMergeX
//
//  Created by malcom on 10/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "MainWndController.h"
#import "PDFDocumentsController.h"

@class MainWndController;
@interface SimpleMergeController : NSObject {
	IBOutlet	NSTableView			*tbl_listedPDFs;
	IBOutlet	MainWndController	*controller_mainWindow;
	IBOutlet	NSWindow			*ass_mainWindow;
}

@property (assign) NSTableView		*tbl_listedPDFs;

- (PDFDocumentsController *) _documentController;

- (IBAction) btn_addPDFs:(id) sender;
- (IBAction) btn_removePDFs:(id) sender;
- (IBAction) btn_moveUp:(id) sender;
- (IBAction) btn_moveDown:(id) sender;

- (PDFDocument *) selectedDocument;

@end
