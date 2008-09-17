//
//  PDFPage_Extensions.h
//  PDFMergeX
//
//  Created by malcom on 09/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <Quartz/Quartz.h>


@interface PDFPage (PDFPage_Extensions)


- (NSImage *)thumbnailWithSize:(float)size forBox:(PDFDisplayBox)box shadowBlurRadius:(float)shadowBlurRadius shadowOffset:(NSSize)shadowOffset readingBarRect:(NSRect)readingBarRect;
- (NSImage *)thumbnailWithSize:(float)size forBox:(PDFDisplayBox)box readingBarRect:(NSRect)readingBarRect;
- (NSImage *)imageForBox:(PDFDisplayBox)box;
- (NSImage *)image;

@end
