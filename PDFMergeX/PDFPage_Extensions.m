//
//  PDFPage_Extensions.m
//  PDFMergeX
//
//  Created by malcom on 09/05/08.
//  Copyright 2008 malcom-mac software. All rights reserved.
//

#import "PDFPage_Extensions.h"


@implementation PDFPage (PDFPage_Extensions)



static inline NSPoint SKSubstractPoints(NSPoint aPoint, NSPoint bPoint) {
    return NSMakePoint(aPoint.x - bPoint.x, aPoint.y - bPoint.y);
}

- (NSImage *)image {
    return [self imageForBox:kPDFDisplayBoxCropBox];
}

- (NSImage *)imageForBox:(PDFDisplayBox)box {
    NSRect bounds = [self boundsForBox:box];
    NSImage *image = [[NSImage alloc] initWithSize:bounds.size];
    
    [image lockFocus];
    [[NSGraphicsContext currentContext] setImageInterpolation:NSImageInterpolationHigh];
    if ([self rotation]) {
        NSAffineTransform *transform = [NSAffineTransform transform];
        [transform rotateByDegrees:[self rotation]];
        switch ([self rotation]) {
            case 90:
                [transform translateXBy:0.0 yBy:-NSWidth(bounds)];
                break;
            case 180:
                [transform translateXBy:-NSWidth(bounds) yBy:-NSHeight(bounds)];
                break;
            case 270:
                [transform translateXBy:-NSHeight(bounds) yBy:0.0];
                break;
        }
        [transform concat];
    }
    [[NSColor whiteColor] set];
    bounds.origin = NSZeroPoint;
    NSRectFill(bounds);
    [self drawWithBox:box]; 
    [image unlockFocus];
    
    return [image autorelease];
}

- (NSImage *)thumbnailWithSize:(float)size forBox:(PDFDisplayBox)box readingBarRect:(NSRect)readingBarRect {
    float shadowBlurRadius = 0;//roundf(size / 32.0);
    float shadowOffset = 0;// - ceilf(shadowBlurRadius * 0.75);
    return  [self thumbnailWithSize:size forBox:box shadowBlurRadius:shadowBlurRadius shadowOffset:NSMakeSize(0.0, shadowOffset) readingBarRect:readingBarRect];
}

- (NSImage *)thumbnailWithSize:(float)size forBox:(PDFDisplayBox)box shadowBlurRadius:(float)shadowBlurRadius shadowOffset:(NSSize)shadowOffset readingBarRect:(NSRect)readingBarRect {
    NSRect bounds = [self boundsForBox:box];
    BOOL isScaled = size > 0.0;
    BOOL hasShadow = shadowBlurRadius > 0.0;
    float scale = 1.0;
    NSSize thumbnailSize;
    NSRect pageRect = NSZeroRect;
    NSImage *image;
    
    if ([self rotation] % 180 == 90)
        bounds = NSMakeRect(NSMinX(bounds), NSMinY(bounds), NSHeight(bounds), NSWidth(bounds));
    
    if (isScaled) {
        if (NSHeight(bounds) > NSWidth(bounds))
            thumbnailSize = NSMakeSize(roundf((size - 2.0 * shadowBlurRadius) * NSWidth(bounds) / NSHeight(bounds) + 2.0 * shadowBlurRadius), size);
        else
            thumbnailSize = NSMakeSize(size, roundf((size - 2.0 * shadowBlurRadius) * NSHeight(bounds) / NSWidth(bounds) + 2.0 * shadowBlurRadius));
        scale = fminf((thumbnailSize.width - 2.0 * shadowBlurRadius) / NSWidth(bounds), (thumbnailSize.height - 2.0 * shadowBlurRadius) / NSHeight(bounds));
    } else {
        thumbnailSize = NSMakeSize(NSWidth(bounds) + 2.0 * shadowBlurRadius, NSHeight(bounds) + 2.0 * shadowBlurRadius);
    }
    
    readingBarRect.origin = SKSubstractPoints(readingBarRect.origin, bounds.origin);
    
    image = [[NSImage alloc] initWithSize:thumbnailSize];
    [image lockFocus];
    [[NSGraphicsContext currentContext] setImageInterpolation:NSImageInterpolationHigh];
    [NSGraphicsContext saveGraphicsState];
    [[NSColor whiteColor] set];
    if (hasShadow) {
        NSShadow *shadow = [[NSShadow alloc] init];
        [shadow setShadowColor:[NSColor colorWithCalibratedWhite:0.0 alpha:0.5]];
        [shadow setShadowBlurRadius:shadowBlurRadius];
        [shadow setShadowOffset:shadowOffset];
        [shadow set];
        [shadow release];
    }
    pageRect.size = thumbnailSize;
    pageRect = NSInsetRect(pageRect, shadowBlurRadius, shadowBlurRadius);
    pageRect.origin.x -= shadowOffset.width;
    pageRect.origin.y -= shadowOffset.height;
    NSRectFill(pageRect);
    [NSGraphicsContext restoreGraphicsState];
    if (isScaled || hasShadow) {
        NSAffineTransform *transform = [NSAffineTransform transform];
        if (isScaled)
            [transform scaleBy:scale];
        [transform translateXBy:(shadowBlurRadius - shadowOffset.width) / scale yBy:(shadowBlurRadius - shadowOffset.height) / scale];
        [transform concat];
    }
    [self drawWithBox:box]; 
    if (NSIsEmptyRect(readingBarRect) == NO) {
        [[NSColor blueColor] setFill];
       // if ([[NSUserDefaults standardUserDefaults] boolForKey:SKReadingBarInvertKey]) {
        /*    NSRect outRect, ignored;
            bounds.origin = NSZeroPoint;
            NSDivideRect(bounds, &outRect, &ignored, NSMaxY(bounds) - NSMaxY(readingBarRect), NSMaxYEdge);
            [NSBezierPath fillRect:outRect];
            NSDivideRect(bounds, &outRect, &ignored, NSMinY(readingBarRect) - NSMinY(bounds), NSMinYEdge);
            [NSBezierPath fillRect:outRect];
        } else {*/
            CGContextSetBlendMode([[NSGraphicsContext currentContext] graphicsPort], kCGBlendModeMultiply);
            [NSBezierPath fillRect:readingBarRect];
        //}
    }
    [image unlockFocus];
    
	return image;
}


@end
