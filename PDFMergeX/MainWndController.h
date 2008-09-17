//
//  MainWndController.h
//  PDFMergeX
//
//  Created by malcom on 09/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <PDFKit/PDFKit.h>
#import <Quartz/Quartz.h>
#import "DragDropImageView.h"
#import "SimpleMergeController.h"

#import "PDFDocumentsController.h"
#import "AdvancedMergeController.h"
#import "PreviewWindowController.h"

@class SimpleMergeController;
@class AdvancedMergeController;
@interface MainWndController : NSObject <DragAndDropImageView_Protocol>{
	IBOutlet	DragDropImageView		*dropImageView;
	IBOutlet	SimpleMergeController	*controller_pdfList;
	IBOutlet	AdvancedMergeController	*controller_advancedMerge;
	IBOutlet	PreviewWindowController *controller_previewWindow;
	
	IBOutlet	NSWindow				*ass_mainWindow;
	IBOutlet	NSWindow				*ass_regWindow;

	IBOutlet	NSWindow				*window_about;
	IBOutlet	NSTextField				*window_about_version;
	IBOutlet	NSView					*view_saveView;
	IBOutlet	NSTextField				*view_saveView_author;
	IBOutlet	NSTextField				*view_saveView_title;
	
	IBOutlet	NSSegmentedControl		*sgm_workMode;
	IBOutlet	NSTabView				*ass_tabView;
	IBOutlet	NSToolbar				*ass_mainWindowToolbar;
	IBOutlet	NSToolbarItem				*ass_workMode;
	
	IBOutlet	NSSegmentedControl			*tbitem_managePages;
	IBOutlet	NSButton					*tbitem_pairPages;
	IBOutlet	NSButton					*tbitem_combine;
	IBOutlet	NSButton					*tbitem_preview;
	IBOutlet	NSSlider					*tbitem_thumbsSize;

	
	IBOutlet	NSWindow				*ass_progressWindow;
	IBOutlet	NSProgressIndicator		*ass_progressIndicator;
	IBOutlet	NSTextField				*ass_progressTitle;
	IBOutlet	NSTextField				*ass_progressSubTitle;
	
	PDFDocumentsController	*ass_documentController;
	
	NSModalSession _session;
	BOOL _endSession;
	NSTimer	*cDownTimer;
	int cDownCounter;
	IBOutlet	NSButton	*btn_license;
	IBOutlet	NSButton	*btn_notNow;
	IBOutlet	NSTextField	*fld_username;
	IBOutlet	NSTextField	*fld_key;

}

@property (assign) PDFDocumentsController	*ass_documentController;
@property (assign) 	PreviewWindowController *controller_previewWindow;

- (IBAction) btn_changeSwitchMode:(id) sender;
- (IBAction) btn_showPreview:(id) sender;
- (IBAction) btn_assemblyPDF:(id) sender;
- (IBAction) btn_managePages:(id) sender;
- (IBAction) btn_pairPages:(id) sender;
- (IBAction) showAbout:(id) sender;
- (IBAction) btn_ab_webSite:(id) sender;
- (IBAction) btn_ab_donate:(id) sender;
- (IBAction) btn_license:(id) sender;
- (IBAction) btn_notNow:(id) sender;

- (void) _updateTBItemVisibility;
- (void) _closeRegWindow;
- (BOOL) lic;

@end
