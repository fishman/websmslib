//
//  WebSMSData.m
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/27/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WebSMSData.h"

@implementation WebSMSData

- (id) initWithUsername:(NSString *) username andPassword:(NSString *) password {
	self = [super init];
	if (self != nil) {
		_username = [username retain];
		_password = [password retain];
	}
	return self;
}

- (void) dealloc {
	[_username release];
	[_password release];
	[_message release];
	[super dealloc];
}


- (void) setMessage:(WebSMSMessage *) message {
	[_message release];
	_message = [message retain];
}

- (NSString *) getUsername {
	return _username;
}
	
- (NSString *) getPassword {
	return _password;
}


- (WebSMSMessage *) getMessage {
	return _message;
}

- (void) setCountryCode:(int) _cc {
	_countryCode = _cc;
}

- (int) getCountryCode {
	return _countryCode;
}

@end
