//
//  PDFPageContainer.m
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "PDFPageContainer.h"


@implementation PDFPageContainer

@synthesize ass_document;
@synthesize ass_page;
@synthesize ass_originalDocPageIndex;

+ (id) pdfPageContainerWithPage:(PDFPage *) cPage numOfPage:(int) pageIdx fromDocument:(PDFMergerDocument *) cDoc {
	PDFPageContainer *cPageContainer = [[PDFPageContainer alloc] init];
	cPageContainer.ass_page = cPage;
	cPageContainer.ass_document = cDoc;
	cPageContainer.ass_originalDocPageIndex = pageIdx;
	cPageContainer.ass_pageType = PDFPage_Type_PageContainer;
	return cPageContainer;
}

- (PDFPage *) getPage {
	return ass_page;
}

- (NSString *) description {
	return [NSString stringWithFormat: @"Original Doc Page Idx %d of %@",ass_originalDocPageIndex,[ass_document.ass_absolutePath lastPathComponent]];
}

@end
