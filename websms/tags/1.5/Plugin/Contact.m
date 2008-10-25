//
//  Contact.m
//  ABPlugin
//
//  Created by delphine on 7-02-2006.
//  Copyright 2006 Emeraldion Lodge. All rights reserved.
//

#import "Contact.h"


@implementation Contact

- (id)initWithName:(NSString *)aName AndNumber:(NSString *)aNumber
{
	self = [super init];
	[self setName:aName];
	[self setNumber:aNumber];
	return self;
}

- (NSString *)description
{
	return [NSString stringWithFormat:@"%@ (%@)", [self name], [self number]];
}

- (void)setName:(NSString *)aName
{
	[aName retain];
	[name release];
	name = aName;
}

- (NSString *)name
{
	return name;
}

- (void)setNumber:(NSString *)aNumber
{
	[aNumber retain];
	[number release];
	number = aNumber;
}

- (NSString *)number
{
	return number;
}

- (NSComparisonResult)caseInsensitiveCompare:(Contact *)aContact
{
	return [[self description] caseInsensitiveCompare:[aContact description]];
}

@end
