//
//  NSData_Extensions.m
//  websmslib
//
//  Created by malcom on 9/4/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "NSData_Extensions.h"


@implementation NSData (NSData_Extensions)

- (NSData *) favIconResize {


#ifdef TARGET_OS_MAC
	float resizeWidth = 16.0;
	float resizeHeight = 16.0;
	NSImage *sourceImage = [[NSImage alloc] initWithData: self];
	NSImage *resizedImage = [[NSImage alloc] initWithSize: NSMakeSize(resizeWidth, resizeHeight)];

	NSSize originalSize = [sourceImage size];
	//NSLog(@"original size was %.2f,%.2f",originalSize.width,originalSize.height);
	
	[resizedImage lockFocus];
	[sourceImage drawInRect: NSMakeRect(0, 0, resizeWidth, resizeHeight) fromRect: NSMakeRect(0, 0, originalSize.width, originalSize.height) operation: NSCompositeSourceOver fraction: 1.0];
	[resizedImage unlockFocus];

	NSData *resizedData = [[NSData alloc] initWithData: [resizedImage TIFFRepresentation]];

	[sourceImage release];
	[resizedImage release];
	[self release];
	return [resizedData autorelease];
#else
	// uysare UIImage
	return self;
#endif
	
	return self;
}

@end
