//
//  PDFRawPage.h
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <Quartz/Quartz.h>

typedef enum PDFPage_Type {
	PDFPage_Type_PageContainer	= 0,
	PDFPage_Type_EmptyPage		= 1,
	PDFPage_Type_ImportedPage	= 2
} PDFPage_Type;


@interface PDFRawPage : NSObject {
	int ass_pageType;
}

@property (assign) int ass_pageType;

- (PDFPage *) getPage;

@end
