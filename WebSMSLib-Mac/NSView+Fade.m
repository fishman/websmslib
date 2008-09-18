//
//  NSView+Fade.m
//  websmslib
//
//  Created by malcom on 9/5/08.
//  Copyright 2008 http://www.malcom-mac.com. All rights reserved.
//

#import "NSView+Fade.h"

/**
	A category on NSView that allows fade in/out on setHidden:
 */
@implementation NSView(Fade)

- (void) exchangeView:(NSView *) _toHide withView:(NSView*) _toShow {
	// start animation
	if ( [[self subviews] count] >0 && [[self subviews] objectAtIndex: 0] == _toShow) {
		NSLog(@"Cannot exchange subview: already ok %@",_toShow);
	} else {
		NSLog(@"Change view %@ with %@",_toHide,_toShow);
		NSView *_destinationView = self;
		[_destinationView setHidden:YES withFade: YES];
		[_toHide removeFromSuperview];

		[_destinationView addSubview: _toShow];
		[_destinationView setHidden:NO withFade: YES];
		[_destinationView setNeedsDisplay: YES];
	}
}


- (IBAction)setHidden:(BOOL)hidden withFade:(BOOL)fade {
	[self setHidden: hidden withFade: fade blocking: YES];
}

/**
	Hides or unhides an NSView, making it fade in or our of existance.
 @param hidden YES to hide, NO to show
 @param fade if NO, just setHidden normally.
*/
- (IBAction)setHidden:(BOOL)hidden withFade:(BOOL)fade blocking:(BOOL)blocking{
	if(!fade) {
		// The easy way out.  Nothing to do here...
		[self setHidden:hidden];
	} else {
		if(!hidden) {
			// If we're unhiding, make sure we queue an unhide before the animation
			[self setHidden:NO];
		}
		NSMutableDictionary *animDict = [NSMutableDictionary dictionaryWithCapacity:2];
		[animDict setObject:self forKey:NSViewAnimationTargetKey];
		[animDict setObject:(hidden ? NSViewAnimationFadeOutEffect : NSViewAnimationFadeInEffect) forKey:NSViewAnimationEffectKey];
		NSViewAnimation *anim = [[NSViewAnimation alloc] initWithViewAnimations:[NSArray arrayWithObject:animDict]];
		if(blocking){
			[anim setAnimationBlockingMode:NSAnimationBlocking];
		}
		[anim setDuration:0.5];
		[anim startAnimation];
		[anim autorelease];
	}	
}

- (IBAction)setFrame:(NSRect)frame blocking:(BOOL)blocking{
	NSMutableDictionary *animDict = [NSMutableDictionary dictionaryWithCapacity:2];
	[animDict setObject:self forKey:NSViewAnimationTargetKey];
	[animDict setObject:[NSValue valueWithRect:frame] forKey:NSViewAnimationEndFrameKey];
	NSViewAnimation *anim = [[NSViewAnimation alloc] initWithViewAnimations:[NSArray arrayWithObject:animDict]];
	if(blocking){
		[anim setAnimationBlockingMode:NSAnimationBlocking];
	}
	[anim setDuration:0.2];
	[anim startAnimation];
	[anim autorelease];
}
@end