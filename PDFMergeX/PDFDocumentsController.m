//
//  PDFDocumentsController.m
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "PDFDocumentsController.h"


@implementation PDFDocumentsController

@synthesize ass_listOfOpenedPDFs;

- (id) initWithPDFsFiles:(NSArray *) _list {
	self = [super init];
	if (self != nil) {
		ass_listOfOpenedPDFs = [[NSMutableArray alloc] init];
		[self addPDFDocumentsPaths: _list];
	}
	return self;
}

- (void) removePDFDocument:(PDFMergerDocument *) _doc {
	[ass_listOfOpenedPDFs removeObject: _doc];
}

- (void) removePDFDocumentAtPath:(NSString *) _cPath {
	PDFMergerDocument *cDoc = [self existPDFDocumentForPath: _cPath];
	if (cDoc != nil) [ass_listOfOpenedPDFs removeObject: cDoc];
}

- (PDFMergerDocument *) existPDFDocumentForPath:(NSString *) _cPath {
	for (PDFMergerDocument *cPDF in ass_listOfOpenedPDFs)
		if ([cPDF.ass_absolutePath isEqualToString: _cPath])
			return cPDF;
	return nil;
}

- (void) addPDFDocumentsPaths:(NSArray *) _files {
	for (NSString *cPath in _files)
		[self addPDFDocumentAtPath: cPath];
}

- (void) addPDFDocumentAtPath:(NSString *) _cPath {
	if ([self existPDFDocumentForPath: _cPath] == nil) {
		NSLog(@"Adding %@",_cPath);
		[ass_listOfOpenedPDFs addObject: [[PDFMergerDocument alloc] initWithPDFDocumentAtPath: _cPath]];
	}
}

- (int) totalPages {
	int total = 0;
	for (PDFMergerDocument *cDoc in ass_listOfOpenedPDFs)
		total += [[cDoc pdfDocument] pageCount];
	return total;
}

- (PDFMergerDocument *) getDocumentAtIndex:(int) _idx {
	if (_idx > -1 && _idx < [ass_listOfOpenedPDFs count]) return [ass_listOfOpenedPDFs objectAtIndex: _idx];
	return nil;
}

- (int) totalDocuments {
	return [ass_listOfOpenedPDFs count];
}


@end
