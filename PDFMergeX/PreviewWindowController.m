//
//  PreviewWindowController.m
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "PreviewWindowController.h"


@implementation PreviewWindowController

@synthesize ass_previewWindow;

- (void) awakeFromNib {
	[ass_preview_view setAutoScales: YES];
	[pop_zoomFactor selectItemAtIndex:0];
}

- (BOOL) loadPreviewFor:(id) _pageOrDocument {	
	if ([ass_previewWindow isVisible]) {
		if ([_pageOrDocument isKindOfClass: [PDFDocument class]]) {
			ass_loadedDocument = (PDFDocument*)_pageOrDocument;
		} else {
			
			PDFDocument *doc = [[PDFDocument alloc] initWithData: [((PDFPage*)_pageOrDocument) dataRepresentation]];
			ass_loadedDocument = doc;		
		}
		
		[ass_previewWindow setTitle: [NSString stringWithFormat:@"Preview (%d pages)",[ass_loadedDocument pageCount]]];
		
		[ass_preview_view setDocument: ass_loadedDocument];
		return YES;
	} return NO;
}

- (IBAction) btn_goNext:(id) sender {
	[ass_preview_view goToNextPage:nil];
}

- (IBAction) btn_goPrev:(id) sender {
	[ass_preview_view goToPreviousPage: nil];
}

- (IBAction) btn_goFirst:(id) sender {
	[ass_preview_view goToFirstPage: nil];
}

- (IBAction) btn_setZoomLevel:(id) sender {
	double level = -1;
	switch ([sender indexOfSelectedItem]) {
		case 1:
			level = 4.0; break;
		case 2:
			level = 2.0; break;
		case 3:
			level = 1.0; break;
		case 4:
			level = 0.75; break;
		case 5:
			level = 0.50; break;
		case 6:
			level = 0.25; break;
	}
	[ass_preview_view setAutoScales: level == -1];
	
	if (level > -1) {
		[ass_preview_view setAutoScales: NO];
		[ass_preview_view setScaleFactor: level];
	}
}

@end
