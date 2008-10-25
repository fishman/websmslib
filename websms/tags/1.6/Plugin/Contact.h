//
//  Contact.h
//  ABPlugin
//
//  Created by delphine on 7-02-2006.
//  Copyright 2006 Emeraldion Lodge. All rights reserved.
//

#import <Cocoa/Cocoa.h>


@interface Contact : NSObject {
	NSString *name;
	NSString *number;
}

- (void)setName:(NSString *)aName;
- (NSString *)name;
- (void)setNumber:(NSString *)aNumber;
- (NSString *)number;

- (NSComparisonResult)caseInsensitiveCompare:(Contact *)aContact;

@end
