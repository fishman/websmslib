//
//  IKBrowserItem.m
//  PDFMergeX
//
//  Created by malcom on 10/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "IKBrowserItem.h"
#import "PDFPage_Extensions.h"
#import "PDFMergerDocument.h"
#import "PDFPageContainer.h"
#import "PDFEmptyPage.h"


@implementation IKBrowserItem

- (id) initWithPDFRawPage:(PDFRawPage *) _page size:(int) size {
	self = [super init];
	if (self != nil) {
		ass_currentPageContainer = _page;
		ass_size = size;
		ass_index =  (ass_currentPageContainer.ass_pageType == PDFPage_Type_PageContainer ? ((PDFPageContainer*)_page).ass_originalDocPageIndex : 0); //_index;
	}
	return self;
}

- (NSString *) imageTitle {
	switch (ass_currentPageContainer.ass_pageType) {
		case PDFPage_Type_PageContainer:
			return [NSString stringWithFormat: @"Page %d",((PDFPageContainer*)ass_currentPageContainer).ass_originalDocPageIndex];
			break;
		case PDFPage_Type_EmptyPage:
			return  @"Empty Page";
			break;
		case PDFPage_Type_ImportedPage:
			return @"Imported Page";
			break;
	}
	return @"";
}

- (NSString *) imageSubtitle {
	switch (ass_currentPageContainer.ass_pageType) {
		case PDFPage_Type_PageContainer:
			return [((PDFMergerDocument*)((PDFPageContainer*)ass_currentPageContainer).ass_document) documentName];
			break;
		default: return @""; break;
	}
}



- (NSString *) imageUID
{
	NSString *uid;
	if (ass_currentPageContainer.ass_pageType == PDFPage_Type_PageContainer)
		uid=  [NSString stringWithFormat: @"Page%d_%@",ass_index,[self imageSubtitle]];
	else
		uid = [NSString stringWithFormat: @"EmptyPage_%d",ass_index];
	return uid;
}
- (NSString *) imageRepresentationType
{
	return IKImageBrowserNSImageRepresentationType;
}
- (id) imageRepresentation {
	if (_thumbnail == nil) _thumbnail = [[ass_currentPageContainer getPage] thumbnailWithSize: ass_size 
										 										forBox: kPDFDisplayBoxMediaBox 
										 										readingBarRect: NSZeroRect];
	return _thumbnail;
}

- (void) clearThumbnailCache {
	_thumbnail = nil;
}

@end
