//
//  IKBrowserItem.h
//  PDFMergeX
//
//  Created by malcom on 10/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <Quartz/Quartz.h>
#import "PDFRawPage.h"


@interface IKBrowserItem : NSObject {
	PDFRawPage	*ass_currentPageContainer;
	int ass_size;
	int ass_index;
	
	NSImage *_thumbnail;
}

- (id) initWithPDFRawPage:(PDFRawPage *) _page size:(int) size;
- (void) clearThumbnailCache;

@end
