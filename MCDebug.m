#import "MCDebug.h"

id _sharedDebugController;

@implementation MCDebug

+ (MCDebug *) sharedDebug {
	if (! _sharedDebugController )
        [[self alloc] init];
    return _sharedDebugController;
}

- (id) init {
    if ( _sharedDebugController ) {
       return _sharedDebugController;
    } else {
		self = [super init];
		_sharedDebugController = self;
		_delegateView = nil;
		return _sharedDebugController;
    }
}

- (void) dealloc
{
	[_delegateView release];
	[super dealloc];
}


- (void) setDebugON:(BOOL) _de {
	ass_debugOn = _de;
	NSLog(@"DEBUG ON: %d",ass_debugOn);
}

- (void) printDebug:(id) _class message:(NSString *) aFormat, ... {
	if (ass_debugOn) {
		va_list argList;
		NSString *formattedString;

		va_start(argList, aFormat);
		formattedString = [[NSString alloc] initWithFormat: aFormat arguments: argList];
		va_end(argList);
		if (_delegateView != nil) [_delegateView debug_dataReceived: [NSString stringWithString: formattedString]];
		
		[formattedString release];
	}
}

- (void) setDelegate:(NSObject <MCDebug_DelegateProtocol> *) _del {
	[_delegateView release];
	_delegateView = [_del retain];
}

@end
