let connected = false;
basic.showIcon(IconNames.Sad);

// Setup serial connection transmit
function initConnection(): void {
    pins.setPull(1, PinPullMode.PullUp);
    pins.setPull(8, PinPullMode.PullUp);
    serial.redirect(
        SerialPin.P1,
        SerialPin.P8,
        BaudRate.BaudRate115200
    )

    basic.pause(50);
    serial.writeString("command;")
    basic.pause(500);
}

input.logoIsPressed()
{
    music.play(music.tonePlayable(Note.C, music.beat(BeatFraction.Eighth)), music.PlaybackMode.UntilDone)
    serial.writeString("robotic_arm position ?;")
}

input.onButtonPressed(Button.B, function () {
    serial.writeString("robotic_arm moveto x 150 y 100;")
})

input.onButtonPressed(Button.A, function () {
    //serial.writeString("robotic_arm move x 5 y 5;")
    serial.writeString("robotic_arm position ?;")
})

input.onButtonPressed(Button.AB, function() {
    //serial.writeString("robotic_arm recenter;")

    initConnection();
})


serial.onDataReceived(";", () => {
    let received = serial.readString();
    basic.showString(received);
    if (received == "ok;" || received.substr(0, 7) == "Already") {
        connected = true;
        basic.showIcon(IconNames.Happy);
    }
    else
    {
        basic.showString(received);
    }
});

