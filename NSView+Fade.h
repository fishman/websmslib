//
//  NSView+Fade.h
//  websmslib
//
//  Created by malcom on 9/5/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import <Cocoa/Cocoa.h>


@interface NSView(Fade)
- (IBAction)setHidden:(BOOL)hidden withFade:(BOOL)fade blocking:(BOOL)blocking;
- (IBAction)setHidden:(BOOL)hidden withFade:(BOOL)fade;
- (void) exchangeView:(NSView *) _toHide withView:(NSView*) _toShow;
@end
