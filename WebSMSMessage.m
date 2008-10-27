//
//  WebSMSMessage.m
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/27/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "WebSMSMessage.h"


@implementation WebSMSMessage

- (void) setCharset:(NSStringEncoding) _cset {
	_charset = _cset;
}

- (id) initWithMessageBody:(NSString *) text from:(NSString *) from to:(NSString *) to {
	self = [super init];
	if (self != nil) {
		_text = [text retain];
		_from = [from retain];
		_to = [to retain];
		_charset = NSISOLatin1StringEncoding;
	}
	return self;
}

- (void) dealloc
{
	[_text release];
	[_from release];
	[_to release];
	[super dealloc];
}


- (NSString *) _encodedProperty:(NSString *) _property {
	NSString *prop = [[[NSString alloc] initWithData: [_property dataUsingEncoding: _charset]  encoding:_charset] autorelease];
	return [prop stringByAddingPercentEscapesUsingEncoding: _charset];
}

- (NSString *) getTextEncoded:(BOOL) _encoded {
	if (_encoded) return [self _encodedProperty: _text];
	return [_text stringByAddingPercentEscapesUsingEncoding: _charset];
}

- (NSString *) getFrom {
	return [self _encodedProperty: _from];
}

- (NSString *) getTo {
	return [self _encodedProperty: _to];
}

@end
