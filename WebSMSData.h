//
//  WebSMSData.h
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

#import "WebSMSMessage.h"

@interface WebSMSData : NSObject {
	NSString			*_username;		// login username
	NSString			*_password;		// login password
	int					_countryCode;	// use WebSMSCountryCode struct
	
	WebSMSMessage	*_message;			// the message to send
}

- (id) initWithUsername:(NSString *) username andPassword:(NSString *) password;
- (void) setMessage:(WebSMSMessage *) _message;

- (NSString *) getUsername;
- (NSString *) getPassword;
- (WebSMSMessage *) getMessage;
- (void) setCountryCode:(int) _cc;
- (int) getCountryCode;

@end
