//
//  PreviewWindowController.h
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <Quartz/Quartz.h>
#import <PDFKit/PDFView.h>

@interface PreviewWindowController : NSObject {
	IBOutlet	NSWindow				*ass_previewWindow;
	IBOutlet	PDFView					*ass_preview_view;
	IBOutlet	NSPopUpButton			*pop_zoomFactor;
				PDFDocument				*ass_loadedDocument;
}

@property (assign) NSWindow	*ass_previewWindow;

- (BOOL) loadPreviewFor:(id) _pageOrDocument;

- (IBAction) btn_setZoomLevel:(id) sender;
- (IBAction) btn_goNext:(id) sender;
- (IBAction) btn_goPrev:(id) sender;
- (IBAction) btn_goFirst:(id) sender;

@end
