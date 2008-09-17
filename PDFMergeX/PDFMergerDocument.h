//
//  PDFMergerDocument.h
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <Quartz/Quartz.h>
#import "PDFPageContainer.h"

@class PDFPageContainer;
@interface PDFMergerDocument : NSObject {
	NSString		*ass_absolutePath;
	PDFDocument		*ass_pdfDocument;
}

@property (readonly) NSString *ass_absolutePath;

- (id) initWithPDFDocumentAtPath:(NSString *) _absolutePath;

- (PDFDocument *) pdfDocument;
- (NSArray *) pdfPages;
- (int) totalPages;

- (NSString *) documentName;

@end
