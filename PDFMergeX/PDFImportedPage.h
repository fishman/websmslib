//
//  PDFImportedPage.h
//  PDFMergeX
//
//  Created by malcom on 8/14/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "PDFRawPage.h"

@interface PDFImportedPage : PDFRawPage {
	PDFPage	*ass_page;
	int		ass_originalDocPageIndex;
	NSString	*ass_originalDocPath;
}

@property (readonly) int		ass_originalDocPageIndex;
@property (readonly) NSString	*ass_originalDocPath;

- (id) initWithPage:(PDFPage *) _page atIndex:(int) _idx atPath:(NSString *) _path;

@end
