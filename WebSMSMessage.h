//
//  WebSMSMessage.h
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/27/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#ifdef TARGET_OS_MAC
	#import <Cocoa/Cocoa.h>
#endif
#ifdef IPHONE
	#import <Foundation/Foundation.h>
#endif

@interface WebSMSMessage : NSObject {
	NSString		*_text;			// Text of the message
	NSString		*_from;			// Author gsm number
	NSString		*_to;			// Destination gsm number
	
	NSStringEncoding	_charset;	// encoding charset
}

- (id) initWithMessageBody:(NSString *) text from:(NSString *) from to:(NSString *) to;
- (NSString *) _encodedProperty:(NSString *) _property;

- (void) setCharset:(NSStringEncoding) _cset;
- (NSString *) getTextEncoded:(BOOL) _encoded;
- (NSString *) getFrom;
- (NSString *) getTo;

@end
