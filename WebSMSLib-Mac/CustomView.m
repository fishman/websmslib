//
//  CustomView.m
//  NSStatusItemTest
//
//  Created by Matt Gemmell on 04/03/2008.
//  Copyright 2008 Magic Aubergine. All rights reserved.
//

#import "CustomView.h"


@implementation CustomView


- (id)initWithFrame:(NSRect)frame controller:(NSObject <hudPanelResponder_Protocol> *)ctrlr
{
    if (self = [super initWithFrame:frame]) {
        controller = ctrlr; // deliberately weak reference.
    }
    
    return self;
}


- (void)dealloc
{
    controller = nil;
    [super dealloc];
}


- (void)drawRect:(NSRect)rect {
    // Draw background if appropriate.
    if (clicked) {
        [[NSColor selectedMenuItemColor] set];
        NSRectFill(rect);
    }
    
    // Draw some text, just to show how it's done.
    NSString *text = @"M"; // whatever you want
    
    NSColor *textColor = [NSColor controlTextColor];
    if (clicked) {
        textColor = [NSColor selectedMenuItemTextColor];
    }
    
    NSFont *msgFont = [NSFont menuBarFontOfSize:15.0];
    NSMutableParagraphStyle *paraStyle = [[NSMutableParagraphStyle alloc] init];
    [paraStyle setParagraphStyle:[NSParagraphStyle defaultParagraphStyle]];
    [paraStyle setAlignment:NSCenterTextAlignment];
    [paraStyle setLineBreakMode:NSLineBreakByTruncatingTail];
    NSMutableDictionary *msgAttrs = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                     msgFont, NSFontAttributeName,
                                     textColor, NSForegroundColorAttributeName,
                                     paraStyle, NSParagraphStyleAttributeName,
                                     nil];
    [paraStyle release];
    
    NSSize msgSize = [text sizeWithAttributes:msgAttrs];
    NSRect msgRect = NSMakeRect(0, 0, msgSize.width, msgSize.height);
    msgRect.origin.x = ([self frame].size.width - msgSize.width) / 2.0;
    msgRect.origin.y = ([self frame].size.height - msgSize.height) / 2.0;
    
    [text drawInRect:msgRect withAttributes:msgAttrs];
	
}


- (void)mouseDown:(NSEvent *)event
{
    NSRect frame = [[self window] frame];
    NSPoint pt = NSMakePoint(NSMidX(frame), NSMinY(frame));
    [controller toggleAttachedWindowAtPoint:pt];
    clicked = !clicked;
    [self setNeedsDisplay:YES];
}


@end
