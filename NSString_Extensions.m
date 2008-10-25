//
//  NSString_Extensions.m
//  websmslib
//
//  created by Daniele 'malcom' Margutti (malcom.mac@gmail.com) on 8/25/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "NSString_Extensions.h"


@implementation NSString (NSString_Extensions)

/**
 *	@method batchReplace
 *	@abstract Replaces the placeholders in the receiver with the arguments.
 *	@discussion This method will search all the occurrences of the keys of
 *	<tt>replacements</tt> contained into the receiver and replace them with
 *	the corresponding value.
 *	@param replacements A dictionary of replacements.
 *	@result The formatted string.
 */
- (NSString *) batchReplace:(NSDictionary *) _replacements {
	NSMutableString *_me = [[NSMutableString alloc] initWithString: self];
	
	NSEnumerator *enumerator = [_replacements keyEnumerator];
	id key;
	
	// Substitute given placeholders with replacements
	while ((key = [enumerator nextObject])) {
				[_me replaceOccurrencesOfString: key 
							 withString: [_replacements objectForKey: key]
								options:NSCaseInsensitiveSearch 
								  range:NSMakeRange(0, [_me length])];
	}
	return [_me autorelease];
}

- (NSString *) trimNumber {
	NSMutableString *number = [[NSMutableString alloc] initWithString: self];
	
	// Remove spaces
	// number = number.replace(/[\s\(\)\-]/g, "");
	[number stringByTrimmingCharactersInSet: [NSCharacterSet characterSetWithCharactersInString: @" \t\n\r"]];
	
	// Remove international prefixes
	if ([number length] > 1 && [number characterAtIndex:0] == '+')
		[number deleteCharactersInRange: NSMakeRange(0, 3)];
	
	return [number autorelease];
}

/**
 *	@method forNumber
 *	@abstract Returns the country code for <tt>number</tt>.
 *	@discussion This method tries to match the initial part of
 *	<tt>number</tt> with a country code in <tt>CountryCodes</tt>.
 *	It returns the user's own code as a failover.
 *	@param the_num The number to return the country code for.
 *	@result The country code for <tt>number</tt>.
 */

- (int) getCountryCodeForNumber {
	if ([self length] < 1) return -1;
	if ([self characterAtIndex:0] != '+') return -1;

	NSDictionary *dic = [[NSDictionary alloc] initWithContentsOfFile: 
						 [NSString stringWithFormat: @"%@/%@",[[NSBundle mainBundle] resourcePath], @"ccountries.plist"]];
	NSArray *ls = [dic allKeys];
	int k;
	for (k=0; k < [ls count]; k++) {
		NSString *cKey = [ls objectAtIndex: k];
		NSString *cVal = [dic objectForKey: cKey];
		
		//if ([self characterAtIndex:0] != '+')
		//	if ([self hasPrefix: [NSString stringWithFormat: @"+%@",cVal]])
		//		return [cVal intValue];
		//else
			if ([self hasPrefix: cVal])
				return [cVal intValue];
	}
	return -1;
}

- (NSString *) completeDomain {
	NSMutableString *str = [[NSMutableString alloc] initWithString: self];
	int start = ([str rangeOfString:@"://"].location != NSNotFound ? [str rangeOfString:@"://"].location+3 : 0);
	
	NSRange loc = [str rangeOfString:@"/" options: NSCaseInsensitiveSearch range:NSMakeRange(start , [str length]-start)];
	if (loc.location != NSNotFound)
		[str deleteCharactersInRange: NSMakeRange(loc.location, [str length]-loc.location)];
	return [str autorelease];
}

- (NSString *) domainStringFromURL {
	NSMutableString *str = [[NSMutableString alloc] initWithString: [self completeDomain]];
	NSRange loc = [str rangeOfString:@"."];
	if (loc.location != NSNotFound) [str deleteCharactersInRange: NSMakeRange(0, loc.location)];
	return [str autorelease];
}

- (NSString *) _getICOUrlFromAddress {
	return [NSString stringWithFormat: @"http://www%@/favicon.ico",[self domainStringFromURL]];
}

- (NSString *) sanitizeString:(NSDictionary *) _replacements {
	if ([_replacements objectForKey:@"CURLOPT_USERPWD"] != nil || [_replacements objectForKey: @"%PASSWORD%"] != nil) {
		NSMutableString *str = [[NSMutableString alloc] initWithString: self];
	
		if ([_replacements objectForKey:@"CURLOPT_USERPWD"] != nil)
			[str replaceOccurrencesOfString: [_replacements objectForKey:@"CURLOPT_USERPWD"]
						 withString: @"[-PASSWORD-]" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [str length])];
	
		if ([_replacements objectForKey: @"%PASSWORD%"] != nil)
			[str replaceOccurrencesOfString: [_replacements objectForKey:@"%PASSWORD%"]
						 withString: @"[-PASSWORD-]" options:NSCaseInsensitiveSearch range:NSMakeRange(0, [str length])];

		return [str autorelease];
	} else return self;
}

- (NSStringEncoding ) returnContentEncodingFromMIME {
	if ([self length] == 0)
		return NSISOLatin1StringEncoding;
	
	NSStringEncoding encoding =  CFStringConvertEncodingToNSStringEncoding(CFStringConvertIANACharSetNameToEncoding((CFStringRef)self));
	if (encoding == kCFStringEncodingInvalidId)
		return NSISOLatin1StringEncoding;
	return encoding;
}

@end
