//
//  PDFImportedPage.m
//  PDFMergeX
//
//  Created by malcom on 8/14/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "PDFImportedPage.h"


@implementation PDFImportedPage

@synthesize ass_originalDocPageIndex;
@synthesize ass_originalDocPath;

- (id) initWithPage:(PDFPage *) _page atIndex:(int) _idx atPath:(NSString *) _path {
	self = [super init];
	if (self != nil) {
		ass_page = _page;
		ass_originalDocPageIndex = _idx;
		ass_pageType = PDFPage_Type_ImportedPage;
		ass_originalDocPath = _path;
	}
	return self;
}

- (PDFPage *) getPage {
	return ass_page;
}

@end
