//
//  PDFMergeWorkflow.h
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "PDFDocumentsController.h"
#import "PDFRawPage.h"
#import "PDFEmptyPage.h"
#import "PDFPageContainer.h"

@protocol PDFMergeWorkflow_Delegate
- (void) pdfMergeWf_startAssemblyForDocuments:(PDFDocumentsController *) _docs totalPages:(int) _pages destination:(NSString *) _destination;
	- (void) pdfMergeWf_assemblyPage:(PDFRawPage *) _page;
	- (void) pdfMergeWf_writingDocument:(PDFDocument *) _doc;
	- (void) pdfMergeWf_assemblyFinished:(PDFDocumentsController *) workflowDocuments;
@end

@interface PDFMergeWorkflow : NSObject {
	PDFDocumentsController			*ass_documentController;
	id <PDFMergeWorkflow_Delegate>	ass_classDelegate;
	NSMutableArray					*ass_assembledPages;
}

@property (assign) 	PDFDocumentsController	*ass_documentController;
@property (assign) 	id <PDFMergeWorkflow_Delegate> ass_classDelegate;

#pragma mark INIT WORKFLOW
+ (id) workflowWithDocumentsController:(PDFDocumentsController *) _controller andDelegate:(id) _delegate;

#pragma mark ASSEMBLED LIST
- (NSMutableArray *) assembledPages;
- (NSMutableArray *) resetPagesListOrder;
- (NSMutableArray *) filterAssembledPagesBy:(NSArray *) pdfDocuments;
- (int) totalPages;
- (int) getIndexOfPage:(PDFRawPage *) _page;

#pragma mark WORKING WITH WORKFLOW
- (BOOL) movePageAtIndex:(int) _startIdx toIndex:(int) _destIdx;
- (BOOL) movePage:(PDFRawPage *) page toIndex:(int) _idx;
- (BOOL) insertBlankPageAtIndex:(int) _idx withSize:(NSSize) _pageSize;
- (BOOL) insertPage:(PDFRawPage *) page atIndex:(int) _idx;
- (BOOL) removePageAtIndex:(int) _idx;
- (BOOL) removePage:(PDFRawPage *) page;
- (PDFRawPage *) getPageAtIndex:(int) _idx;
- (void) movePagesAtIndexes:(NSIndexSet*) set afterPage:(PDFRawPage *) idxpage;

#pragma mark ASSEMBLY METHOD
- (PDFDocument *) assemblyDocumentAtDestination:(NSString *) _destination withAttributes:(NSDictionary *) _att;

#pragma mark PRIVATE
- (void) _startAssembly:(NSArray *) _params;

@end
