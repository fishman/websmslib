//
//  SubviewTableViewCell.m
//  SubviewTableViewTester
//
//  Created by Joar Wingfors on Sat Feb 15 2003.
//  Copyright (c) 2003 joar.com. All rights reserved.
//

#import "SubviewTableViewCell.h"

#import "SubviewTableViewController.h"

@implementation SubviewTableViewCell

- (void) addSubview:(NSView *) view
{
    // Weak reference
    subview = view;
}

- (void) dealloc
{
    subview = nil;

    [super dealloc];
}

- (NSView *) view
{
    return subview;
}

- (void) drawWithFrame:(NSRect) cellFrame inView:(NSView *) controlView
{
    [super drawWithFrame: cellFrame inView: controlView];

    [[self view] setFrame: cellFrame];

    if ([[self view] superview] != controlView)
    {
	[controlView addSubview: [self view]];
    }
}

@end
