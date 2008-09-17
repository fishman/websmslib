//
//  PDFMergerDocument.m
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "PDFMergerDocument.h"
#import "PDFPage_Extensions.h"
#import "PDFPageContainer.h"

@implementation PDFMergerDocument

@synthesize ass_absolutePath;

- (id) initWithPDFDocumentAtPath:(NSString *) _absolutePath {
	self = [super init];
	if (self != nil) {
		ass_pdfDocument = [[PDFDocument alloc] initWithData: [[NSData alloc] initWithContentsOfFile: _absolutePath]];
		ass_absolutePath = _absolutePath;
	}
	return self;
}

- (NSArray *) pdfPages {
	NSMutableArray *list = [[NSMutableArray alloc] init];
	int k;
	for (k=0; k < [ass_pdfDocument pageCount]; k++) {
		PDFPageContainer *container = [PDFPageContainer pdfPageContainerWithPage: [ass_pdfDocument pageAtIndex:k] numOfPage: k fromDocument: self];
		[list addObject: container];
	}
	return list;
}

- (NSString *) documentName {
	return [[ass_absolutePath lastPathComponent] stringByDeletingPathExtension];
}

- (PDFDocument *) pdfDocument {
	if (ass_pdfDocument == nil)
		ass_pdfDocument = [[PDFDocument alloc] initWithData: [NSData dataWithContentsOfFile: ass_absolutePath]];
	return ass_pdfDocument;
}

- (int) totalPages {
	return [ass_pdfDocument pageCount];
}


@end
