/**
 *	WebSMS widget
 *
 *	© Claudio Procida 2006-2008
 *
 *	Disclaimer
 *
 *	The WebSMS Widget software (from now, the "Software") and the accompanying materials
 *	are provided “AS IS” without warranty of any kind. IN NO EVENT SHALL THE AUTHOR(S) BE
 *	LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
 *	INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN
 *	IF THE AUTHOR(S) HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. The entire risk as to
 *	the results and performance of this software is assumed by you. If the software is
 *	defective, you, and not its author(s), assume the entire cost of all necessary servicing,
 *	repairs and corrections. If you do not agree to these terms and conditions, you may not
 *	install or use this software.
 *
 *  Contact.m
 *  ABPlugin
 *
 *  Created by delphine on 7-02-2006.
 */

#import "Contact.h"


@implementation Contact

- (id)init
{
	return [self initWithName:@"John Doe"
					   number:@"555-123-4567"];
}

+ (Contact *)contact
{
	return [[[self alloc] init] autorelease];
}

+ (Contact *)contactWithName:(NSString *)aName number:(NSString *)aNumber
{
	return [[[self alloc] initWithName:aName
								number:aNumber] autorelease];
}

- (void)dealloc
{
	[self setName:nil];
	[self setNumber:nil];
	[super dealloc];
}

#pragma mark -
#pragma mark Designated initializer

- (id)initWithName:(NSString *)aName number:(NSString *)aNumber
{
	if (self = [super init])
	{
		[self setName:aName];
		[self setNumber:aNumber];
	}
	return self;
}

#pragma mark -
#pragma mark Setters/Getters

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

#pragma mark -

- (NSComparisonResult)caseInsensitiveCompare:(Contact *)aContact
{
	return [[self description] caseInsensitiveCompare:[aContact description]];
}

- (NSString *)description
{
	return [NSString stringWithFormat:@"%@ (%@)", [self name], [self number]];
}

@end
