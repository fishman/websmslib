//
//  SubviewController.h
//  SubviewTableViewTester
//
//  Created by Joar Wingfors on Tue Dec 02 2003.
//  Copyright (c) 2003 joar.com. All rights reserved.
//

/*****************************************************************************

SubviewController

Overview:

The SubviewController is a very simple class. It is the controller object for
the custom views used in the table. It provides the view, and answers to
actions methods from the view or the table view controller.

*****************************************************************************/

#import <AppKit/AppKit.h>

@interface SubviewController : NSObject
{
    IBOutlet NSView *subview;
}

- (id) initWithBundleNamed:(NSString *) _nibname;

// Convenience factory method
+ (id) controller;

// The view displayed in the table view
- (NSView *) view;

@end
