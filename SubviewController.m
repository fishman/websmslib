//
//  SubviewController.m
//  SubviewTableViewTester
//
//  Created by Joar Wingfors on Tue Dec 02 2003.
//  Copyright (c) 2003 joar.com. All rights reserved.
//

#import "SubviewController.h"

@implementation SubviewController

+ (id) controller
{
    return [[[self alloc] init] autorelease];
}

- (id) initWithBundleNamed:(NSString *) _nibname
{
    if ((self = [super init]) != nil)
    {
        if (![NSBundle loadNibNamed: _nibname owner: self])
        {
            [self release];
            self = nil;
        } else NSLog(@"Loaded nib %@",_nibname);
    }
    
    return self;
}

- (void) dealloc
{
    [subview release];
    
    [super dealloc];
}

- (NSView *) view
{
    return subview;
}

@end
