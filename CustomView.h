//
//  CustomView.h
//  NSStatusItemTest
//
//  Created by Matt Gemmell on 04/03/2008.
//  Copyright 2008 Magic Aubergine. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@protocol hudPanelResponder_Protocol
- (void)toggleAttachedWindowAtPoint:(NSPoint)pt;
@end

@class AppController;
@interface CustomView : NSView {
    __weak NSObject <hudPanelResponder_Protocol> *controller;
    BOOL clicked;
}

- (id)initWithFrame:(NSRect)frame controller:(NSObject <hudPanelResponder_Protocol> *)ctrlr;

@end
