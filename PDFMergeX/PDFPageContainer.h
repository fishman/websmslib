//
//  PDFPageContainer.h
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "PDFMergerDocument.h"
#import "PDFRawPage.h"

@class PDFMergerDocument;
@interface PDFPageContainer : PDFRawPage {
	PDFMergerDocument	*ass_document;
	PDFPage				*ass_page;
	int					 ass_originalDocPageIndex;
}

@property (assign) PDFMergerDocument	*ass_document;
@property (assign) PDFPage				*ass_page;
@property (assign) int					 ass_originalDocPageIndex;

+ (id) pdfPageContainerWithPage:(PDFPage *) cPage numOfPage:(int) pageIdx fromDocument:(PDFMergerDocument *) cDoc;

@end
