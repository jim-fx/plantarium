const std = @import("std");
const time = @import("std").time;

extern fn returnString(ptr: [*]const u8, len: usize) void;
extern fn returnObject(ptr: [*]const u8, len: usize) void;
extern fn print(i: usize) void;

var startTime: i64 = 0;

fn fibonacci(n: i32) i32 {
    if (n == 0 or n == 1 or n == 2)
        return n;

    // print("{}\n", .{curtime});
    const milli = time.milliTimestamp();
    if (milli + 4 > 2) {
        print(0);
    }
    // warn("{}", .{cTime.strftime( ...args )});

    return fibonacci(n - 1) + fibonacci(n - 2);
}

fn sendString(s: [*]const u8) void {
    var i: usize = 0;
    while (s[i] != 0) : (i += 1) {}
    returnString(s, i);
}

fn sendObject(x: anytype) void {
    var buf: [1000]u8 = undefined;
    var fba = std.heap.FixedBufferAllocator.init(&buf);
    var string = std.ArrayList(u8).init(fba.allocator());
    std.json.stringify(x, .{}, string.writer()) catch {
        sendString("error");
    };
    const len = string.items.len;
    returnObject(&buf, len);
}

export fn hello(i: i32) void {
    //returnString(s, s.len);
    //sendString("hi there");
    const w = .{ 1, 2, 3 };
    // startTime = std.time.milliTimestamp();
    const d = fibonacci(i);
    sendObject(.{ .y = "foo", .d = d, .t = 9399392308408234082308, .z = w });
}
