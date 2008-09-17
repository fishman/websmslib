//
//  PDFEmptyPage.m
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "PDFEmptyPage.h"


@implementation PDFEmptyPage

@synthesize ass_size;

+ (id) emptyPageWithSize:(NSSize) _size {
	PDFEmptyPage *empty = [[PDFEmptyPage alloc] init];
	empty.ass_size = _size;
	empty.ass_pageType = PDFPage_Type_EmptyPage;
	return empty;
}

- (PDFPage *) getPage {
	PDFPage *ePage = [[PDFPage alloc] initWithImage: [[NSImage alloc] initWithSize: ass_size]];
	return ePage;
}

- (NSData *) dataRepresentation {
	return [[self getPage] dataRepresentation];
}

@end
