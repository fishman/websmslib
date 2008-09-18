//
//  NSString_Extensions.h
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/25/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#ifdef TARGET_OS_MAC
	#import <Cocoa/Cocoa.h>
#endif
#ifdef IPHONE
	#import <Foundation/Foundation.h>
#endif

@interface NSString (NSString_Extensions)

- (NSString *) batchReplace:(NSDictionary *) _replacements;
- (NSString *) trimNumber;
- (int) getCountryCodeForNumber;
- (NSString *) domainStringFromURL;
- (NSString *) _getICOUrlFromAddress;
- (NSString *) sanitizeString:(NSDictionary *) _replacements;
- (NSString *) completeDomain;
- (NSStringEncoding ) returnContentEncodingFromMIME;

@end
