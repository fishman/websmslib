//
//  DKPopUpButtonCell.m
//  DarkKit
//
//  Created by Chad Weider on 3/20/08.
//  Copyright (c) 2008 Chad Weider
//  Some rights reserved: <http://www.opensource.org/licenses/zlib-license.php>
//  
//  This software is provided 'as-is', without any express or implied warranty.
//  In no event will the authors be held liable for any damages arising from the
//  use of this software.
//  
//  Permission is granted to anyone to use this software for any purpose,
//  including commercial applications, and to alter it and redistribute it
//  freely, subject to the following restrictions:
//  
//  1. The origin of this software must not be misrepresented; you must not   
//  claim that you wrote the original software. If you use this software in a
//  product, an acknowledgment in the product documentation would be appreciated
//  but is not required.
//  
//  2. Altered source versions must be plainly marked as such, and must not be
//  misrepresented as being the original software.
//  
//  3. This notice may not be removed or altered from any source distribution.
//

#import "DKPopUpButtonCell.h"

#import "NSBezierPath+PXRoundedRectangleAdditions.h"
#import "CTGradient.h"
#import "DKDefines.h"

@interface DKPopUpButtonCell (DKPopUpButtonCellPrivate)
- (NSDictionary *)_textAttributes;
- (int)_buttonType;
@end


@implementation DKPopUpButtonCell

- (void)drawBezelWithFrame:(NSRect)frame inView:(NSView *)controlView
  {
  if([self bezelStyle] == NSRoundedBezelStyle)
	{
	NSRect buttonRect;
	float buttonHeight;
	float buttonXPad;
	float buttonYShift;
	float buttonBoxHeight;
	float cornerRadius;
	
	switch([self controlSize])
		{
		case NSRegularControlSize:
			buttonXPad = 7;
			buttonYShift = 1;
			buttonBoxHeight = 25;
			buttonHeight = 20;
			cornerRadius = 4;
							break;
		case NSSmallControlSize:
			buttonXPad = 4;
			buttonYShift = 1;
			buttonBoxHeight = 21;
			buttonHeight = 17;
			cornerRadius = 4;
							break;
		case NSMiniControlSize:
			buttonXPad = 2;
			buttonYShift = 1;
			buttonBoxHeight = 17;
			buttonHeight = 14;
			cornerRadius = 3;
							break;
		default:
			;
		}
	buttonRect = NSMakeRect(frame.origin.x+buttonXPad+.5, floorf(NSMidY(frame)-(buttonBoxHeight)/2)+buttonYShift+.5, frame.size.width-2*buttonXPad, buttonHeight);
	NSBezierPath *bezelPath = [NSBezierPath bezierPathWithRoundedRect:buttonRect cornerRadius:cornerRadius];
	
    CTGradient *fillGradient;
	if([self isHighlighted])
		fillGradient = [CTGradient gradientWithBeginningColor:[NSColor colorWithCalibratedWhite:.4 alpha:1.0]
                                                  endingColor:[NSColor colorWithCalibratedWhite:.2 alpha:1.0]];
	else
        fillGradient = [CTGradient gradientWithBeginningColor:[NSColor colorWithCalibratedWhite:.3 alpha:1.0]
                                                  endingColor:[NSColor colorWithCalibratedWhite:.0 alpha:1.0]];
    
	[fillGradient fillBezierPath:bezelPath angle:90.0];

	[bezelPath setLineWidth:1];
	[[NSColor colorWithCalibratedWhite:1 alpha:1] set];
	[bezelPath stroke];
	
	[self drawIndicatorWithFrame:frame inView:controlView];
	}
  else
	{
	[super drawBezelWithFrame:frame inView:controlView];
    }
  }

- (void)drawIndicatorWithFrame:(NSRect)frame inView:(NSView *)controlView
  {
  float buttonHeight;
  float buttonXPad;
  float buttonYShift;
  float buttonBoxHeight;
  float triangleSize;
  
  switch([self controlSize])
  	{
  	case NSRegularControlSize:
  		buttonXPad = 7;
  		buttonYShift = 1;
  		buttonBoxHeight = 25;
  		buttonHeight = 20;
		triangleSize = 5;
  						break;
  	case NSSmallControlSize:
  		buttonXPad = 4;
  		buttonYShift = 1;
  		buttonBoxHeight = 21;
  		buttonHeight = 17;
		triangleSize = 4;
  						break;
	case NSMiniControlSize:
  		buttonXPad = 2;
  		buttonYShift = 1;
  		buttonBoxHeight = 17;
  		buttonHeight = 14;
		triangleSize = 3;
						break;
	}
  NSRect buttonRect = NSMakeRect(frame.origin.x+buttonXPad+.5, floorf(NSMidY(frame)-(buttonBoxHeight)/2)+buttonYShift+.5, frame.size.width-2*buttonXPad, buttonHeight);
  
  NSBezierPath *upTrianglePath = [self bezierPathWithTriangleInRect:NSMakeRect(NSMaxX(buttonRect)-7-triangleSize, ceilf(NSMidY(buttonRect))+1, triangleSize, 3.5) up:YES];
  NSBezierPath *downTrianglePath = [self bezierPathWithTriangleInRect:NSMakeRect(NSMaxX(buttonRect)-7-triangleSize, ceilf(NSMidY(buttonRect))-2-(3.5), triangleSize, 3.5) up:NO];
  
  [[NSColor whiteColor] set];
  
  [upTrianglePath fill];
  [downTrianglePath fill];
  
  [[NSColor colorWithDeviceWhite:.65 alpha:.45] set];
  NSRectFill(NSMakeRect(NSMaxX(buttonRect)-18.5, NSMinY(buttonRect)+2, 1, NSHeight(buttonRect)-4));
  }


- (NSBezierPath *)bezierPathWithTriangleInRect:(NSRect)rect up:(bool)up
  {
  NSBezierPath *trianglePath = [NSBezierPath bezierPath];
  
  if(up)
	{
	[trianglePath moveToPoint:NSMakePoint(NSMinX(rect), NSMinY(rect))];
	[trianglePath lineToPoint:NSMakePoint(NSMaxX(rect), NSMinY(rect))];
	[trianglePath lineToPoint:NSMakePoint(NSMidX(rect), NSMaxY(rect))];
	[trianglePath closePath];
	}
  else
	{
	[trianglePath moveToPoint:NSMakePoint(NSMinX(rect), NSMaxY(rect))];
	[trianglePath lineToPoint:NSMakePoint(NSMaxX(rect), NSMaxY(rect))];
	[trianglePath lineToPoint:NSMakePoint(NSMidX(rect), NSMinY(rect))];
	[trianglePath closePath];
	}
 
  return trianglePath;
  }

- (NSDictionary *)_textAttributes
  {
  NSMutableDictionary *aDict = [[NSMutableDictionary alloc] init];
  [aDict addEntriesFromDictionary:[super _textAttributes]];
  [aDict setObject:[NSColor colorWithCalibratedWhite:DKTextWhite alpha:1] forKey:NSForegroundColorAttributeName];
  
  return [aDict autorelease];
  }

@end
