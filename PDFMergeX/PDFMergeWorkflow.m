//
//  PDFMergeWorkflow.m
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "PDFMergeWorkflow.h"
#import "PDFRawPage.h"
#import <PDFKit/PDFKit.h>

@implementation PDFMergeWorkflow

@synthesize ass_documentController;
@synthesize ass_classDelegate;

+ (id) workflowWithDocumentsController:(PDFDocumentsController *) _controller andDelegate:(id) _delegate {
	PDFMergeWorkflow *workflow = [[PDFMergeWorkflow alloc] init];
	workflow.ass_documentController = _controller;
	workflow.ass_classDelegate = _delegate;
	return workflow;
}

- (NSMutableArray *) filterAssembledPagesBy:(NSArray *) pdfDocuments {
	NSMutableArray *pages = [[NSMutableArray alloc] init];
	for (PDFRawPage *cPage in ass_assembledPages) {
		if (cPage.ass_pageType == PDFPage_Type_PageContainer) {
			if ([pdfDocuments containsObject: ((PDFPageContainer*)cPage).ass_document]) {
				[pages addObject: cPage];
			}
		} else [pages addObject: cPage]; // EMPTY PAGE
	}
	return pages;
}

- (NSMutableArray *) resetPagesListOrder {
	NSMutableArray *list = [[NSMutableArray alloc] init];
	for (PDFMergerDocument *cDoc in ass_documentController.ass_listOfOpenedPDFs)
		[list addObjectsFromArray: [cDoc pdfPages]];
	
	ass_assembledPages = list;
	return ass_assembledPages;
}

- (int) totalPages {
	return [ass_assembledPages count];
}

- (NSMutableArray *) assembledPages {
	if (ass_assembledPages == nil) ass_assembledPages = [self resetPagesListOrder];
	return ass_assembledPages;
}

- (int) getIndexOfPage:(PDFRawPage *) _page {
	return [ass_assembledPages indexOfObject: _page];
}

- (void) movePagesAtIndexes:(NSIndexSet*) set afterPage:(PDFRawPage *) idxpage {
	NSArray *newObjects = [ass_assembledPages objectsAtIndexes: set];
	// remove from old position
	[ass_assembledPages removeObjectsAtIndexes: set];
	
	// insert
	int startIndex = [ass_assembledPages indexOfObject: idxpage];
	 
	for (PDFRawPage *cPage in newObjects) {
		[ass_assembledPages insertObject: cPage atIndex:startIndex];
		startIndex++;
	}
}

- (PDFDocument *) assemblyDocumentAtDestination:(NSString *) _destination withAttributes:(NSDictionary *) _att {
	if ([[NSFileManager defaultManager] fileExistsAtPath: _destination] == YES)
		[[NSFileManager defaultManager] removeFileAtPath: _destination handler: nil];
	
	if ([ass_assembledPages count] == 0) return nil;
	
	// inform delegate
	[ass_classDelegate pdfMergeWf_startAssemblyForDocuments: ass_documentController
													totalPages: [ass_assembledPages count]
												destination: _destination];
	
	
	[[[[ass_assembledPages objectAtIndex:0] getPage] dataRepresentation] writeToFile: _destination atomically: YES];
	
	// create document
	PDFDocument *doc = [[PDFDocument alloc] initWithData: [NSData dataWithContentsOfFile: _destination]]; //[NSData data]];	
	[NSThread detachNewThreadSelector: @selector(_startAssembly:) toTarget:self withObject:[NSArray arrayWithObjects: doc,_destination,nil]];
	//[self _startAssembly: [NSArray arrayWithObjects: doc,_destination,nil]];
	[doc setDocumentAttributes: _att];
	
	return doc;
}

- (void) _startAssembly:(NSArray *) _params {
	PDFDocument * doc = [_params objectAtIndex: 0];
	int k = 0;
	for (PDFRawPage *cRaw in ass_assembledPages) {
		if (k > 0) {
			[doc insertPage: [cRaw getPage] atIndex: k];
			// inform delegate
			[ass_classDelegate pdfMergeWf_assemblyPage: cRaw];
		}
		k++;
	}
	
	[((NSObject*)ass_classDelegate) performSelectorOnMainThread: @selector(pdfMergeWf_writingDocument:) withObject:doc waitUntilDone:NO];

	[doc writeToFile: [_params objectAtIndex: 1]];
	// inform delegate
	[((NSObject*)ass_classDelegate) performSelectorOnMainThread: @selector(pdfMergeWf_assemblyFinished:) withObject:ass_documentController waitUntilDone:NO];
}

- (BOOL) movePageAtIndex:(int) _startIdx toIndex:(int) _destIdx {
	if (_startIdx > -1 && _startIdx < [ass_assembledPages count] && _destIdx > -1 && _destIdx < [ass_assembledPages count]) {
		[ass_assembledPages exchangeObjectAtIndex: _startIdx withObjectAtIndex: _destIdx];
		return YES;
	} else return NO;
}

- (BOOL) movePage:(PDFRawPage *) page toIndex:(int) _idx {
	int startIdx = [ass_assembledPages indexOfObject: page];
	return [self movePageAtIndex: startIdx toIndex: _idx];
}

- (BOOL) insertBlankPageAtIndex:(int) _idx withSize:(NSSize) _pageSize {
	if (_idx > -1) {
		PDFEmptyPage *emptyPage = [PDFEmptyPage emptyPageWithSize: _pageSize];
		if (_idx < [ass_assembledPages count]) [ass_assembledPages insertObject: emptyPage atIndex:_idx];
		else [ass_assembledPages addObject: emptyPage];
	} return NO;
}

- (BOOL) insertPage:(PDFRawPage *) page atIndex:(int) _idx {
	if (_idx > -1) {
		if (_idx < [ass_assembledPages count]) [ass_assembledPages insertObject: page atIndex:_idx];
		else [ass_assembledPages addObject: page];
	} return NO;
}

- (BOOL) removePageAtIndex:(int) _idx {
	if (_idx > -1 && _idx < [ass_assembledPages count]) {
		[ass_assembledPages removeObjectAtIndex:_idx];
	} return NO;
}

- (PDFRawPage *) getPageAtIndex:(int) _idx {
	if (_idx > -1 && _idx < [ass_assembledPages count]) {
		return [ass_assembledPages objectAtIndex:_idx];
	} return nil;
}

- (BOOL) removePage:(PDFRawPage *) page {
	int _idx = [ass_assembledPages indexOfObject: page];
	return [self removePageAtIndex: _idx];
}

@end
