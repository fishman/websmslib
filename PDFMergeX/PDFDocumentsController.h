//
//  PDFDocumentsController.h
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "PDFMergerDocument.h"

@interface PDFDocumentsController : NSObject {
	NSMutableArray		*ass_listOfOpenedPDFs;
}

@property (assign) NSMutableArray		*ass_listOfOpenedPDFs;

- (id) initWithPDFsFiles:(NSArray *) _list;

- (int) totalPages;
- (int) totalDocuments;

- (void) addPDFDocumentAtPath:(NSString *) _cPath;
- (void) addPDFDocumentsPaths:(NSArray *) _files;

- (void) removePDFDocument:(PDFMergerDocument *) _doc;
- (void) removePDFDocumentAtPath:(NSString *) _cPath;

- (PDFMergerDocument *) existPDFDocumentForPath:(NSString *) _cPath;
- (PDFMergerDocument *) getDocumentAtIndex:(int) _idx;

@end
