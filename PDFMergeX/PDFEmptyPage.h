//
//  PDFEmptyPage.h
//  PDFMergeX
//
//  Created by malcom on 11/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "PDFRawPage.h"

@interface PDFEmptyPage : PDFRawPage {
	NSSize	ass_size;
}

@property (assign) NSSize ass_size;

+ (id) emptyPageWithSize:(NSSize) _size;
- (NSData *) dataRepresentation;

@end
