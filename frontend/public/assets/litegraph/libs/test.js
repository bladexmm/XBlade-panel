let defaultLayout = {
    "last_node_id": 19,
    "last_link_id": 28,
    "nodes": [
        {
            "id": 5,
            "type": "输入/图片(ImageInput)",
            "pos": [
                98,
                444
            ],
            "size": [
                120,
                240
            ],
            "flags": {},
            "order": 0,
            "mode": 0,
            "outputs": [
                {
                    "name": "image",
                    "type": "image",
                    "links": [
                        6
                    ],
                    "slot_index": 0
                }
            ],
            "properties": {
                "image": "/img/2024/07/1e2o6.png"
            }
        },
        {
            "id": 1,
            "type": "基础/开始(CMDStart)",
            "pos": [
                -443.8000000000001,
                94.60000000000004
            ],
            "size": [
                80,
                30
            ],
            "flags": {},
            "order": 1,
            "mode": 0,
            "outputs": [
                {
                    "name": "out",
                    "type": "cmd",
                    "links": [
                        8
                    ],
                    "slot_index": 0
                }
            ],
            "properties": {}
        },
        {
            "id": 8,
            "type": "模拟/鼠标左键(MouseLeft)",
            "pos": [
                847,
                295
            ],
            "size": [
                150,
                30
            ],
            "flags": {},
            "order": 11,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 3
                }
            ],
            "outputs": [
                {
                    "name": "out",
                    "type": "cmd",
                    "links": [
                        26
                    ],
                    "slot_index": 0
                }
            ],
            "properties": {
                "type": "click"
            }
        },
        {
            "id": 11,
            "type": "基础/跳转运行(JumpNode)",
            "pos": [
                -535.8000000000002,
                241.59999999999988
            ],
            "size": [
                130,
                50
            ],
            "flags": {},
            "order": 2,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": null
                }
            ],
            "outputs": [
                {
                    "name": "out",
                    "type": "cmd",
                    "links": [
                        11
                    ],
                    "slot_index": 0
                }
            ],
            "properties": {
                "name": "xw550"
            }
        },
        {
            "id": 6,
            "type": "自动化/图片定位(LocateOnScreenNode)",
            "pos": [
                362,
                286
            ],
            "size": [
                200,
                380
            ],
            "flags": {},
            "order": 8,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 24
                },
                {
                    "name": "image",
                    "type": "image",
                    "link": 6
                }
            ],
            "outputs": [
                {
                    "name": "out",
                    "type": "cmd",
                    "links": [
                        4
                    ],
                    "slot_index": 0
                },
                {
                    "name": "location",
                    "type": "location",
                    "links": [
                        5
                    ],
                    "slot_index": 1
                },
                {
                    "name": "error",
                    "type": "cmd",
                    "links": null
                }
            ],
            "properties": {
                "image": "",
                "searchTime": 5,
                "confidence": 0.9,
                "grayscale": false
            }
        },
        {
            "id": 9,
            "type": "基础/合并运行(MultiMerge)",
            "pos": [
                -247,
                118
            ],
            "size": [
                100,
                70
            ],
            "flags": {},
            "order": 5,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 8,
                    "slot_index": 0
                },
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 11
                },
                {
                    "name": "in",
                    "type": "cmd",
                    "link": null
                }
            ],
            "outputs": [
                {
                    "name": "out",
                    "type": "cmd",
                    "links": [
                        15
                    ],
                    "slot_index": 0
                }
            ],
            "properties": {}
        },
        {
            "id": 7,
            "type": "模拟/鼠标移动(MouseMove)",
            "pos": [
                564,
                266
            ],
            "size": [
                190,
                60
            ],
            "flags": {},
            "order": 10,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 4
                },
                {
                    "name": "location",
                    "type": "location",
                    "link": 5
                }
            ],
            "outputs": [
                {
                    "name": "out",
                    "type": "cmd",
                    "links": [
                        3
                    ],
                    "slot_index": 0
                }
            ],
            "properties": {
                "value": "x,y",
                "duration": 0
            }
        },
        {
            "id": 17,
            "type": "输入/文本(TextInput)",
            "pos": [
                -132,
                284
            ],
            "size": [
                180,
                30
            ],
            "flags": {},
            "order": 3,
            "mode": 0,
            "outputs": [
                {
                    "name": "text",
                    "type": "text",
                    "links": [
                        22
                    ],
                    "slot_index": 0
                }
            ],
            "properties": {
                "text": ""
            }
        },
        {
            "id": 14,
            "type": "编程/获取局部变量(GetLocalVariables)",
            "pos": [
                -53,
                92
            ],
            "size": [
                120,
                130
            ],
            "flags": {},
            "order": 6,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 15
                }
            ],
            "outputs": [
                {
                    "name": "out",
                    "type": "cmd",
                    "links": [
                        17
                    ],
                    "slot_index": 0
                },
                {
                    "name": "text",
                    "type": "text",
                    "links": [
                        23
                    ],
                    "slot_index": 1
                },
                {
                    "name": "array",
                    "type": "array",
                    "links": null
                },
                {
                    "name": "location",
                    "type": "location",
                    "links": null
                },
                {
                    "name": "response",
                    "type": "response",
                    "links": null
                }
            ],
            "properties": {
                "name": "test"
            }
        },
        {
            "id": 15,
            "type": "编程/判断(IfValid)",
            "pos": [
                129,
                112
            ],
            "size": [
                120,
                90
            ],
            "flags": {},
            "order": 7,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 17
                },
                {
                    "name": "input1",
                    "type": "text",
                    "link": 23
                },
                {
                    "name": "input2",
                    "type": "text",
                    "link": 22
                }
            ],
            "outputs": [
                {
                    "name": "true",
                    "type": "cmd",
                    "links": [
                        24
                    ],
                    "slot_index": 0
                },
                {
                    "name": "false",
                    "type": "cmd",
                    "links": [
                        25
                    ],
                    "slot_index": 1
                }
            ],
            "properties": {}
        },
        {
            "id": 18,
            "type": "基础/结束(CMDEnd)",
            "pos": [
                327,
                147
            ],
            "size": [
                80,
                30
            ],
            "flags": {},
            "order": 9,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 25
                }
            ],
            "properties": {}
        },
        {
            "id": 10,
            "type": "基础/跳转运行(JumpNode)",
            "pos": [
                1186,
                404
            ],
            "size": [
                130,
                50
            ],
            "flags": {},
            "order": 13,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 27
                }
            ],
            "outputs": [
                {
                    "name": "out",
                    "type": "cmd",
                    "links": null
                }
            ],
            "properties": {
                "name": "xw550"
            }
        },
        {
            "id": 13,
            "type": "编程/配置局部变量(SetLocalVariables)",
            "pos": [
                1035,
                333
            ],
            "size": [
                120,
                130
            ],
            "flags": {},
            "order": 12,
            "mode": 0,
            "inputs": [
                {
                    "name": "in",
                    "type": "cmd",
                    "link": 26,
                    "slot_index": 0
                },
                {
                    "name": "text",
                    "type": "text",
                    "link": 28
                },
                {
                    "name": "array",
                    "type": "array",
                    "link": null
                },
                {
                    "name": "location",
                    "type": "location",
                    "link": null
                },
                {
                    "name": "response",
                    "type": "response",
                    "link": null
                }
            ],
            "outputs": [
                {
                    "name": "out",
                    "type": "cmd",
                    "links": [
                        27
                    ],
                    "slot_index": 0
                }
            ],
            "properties": {
                "name": "test"
            }
        },
        {
            "id": 19,
            "type": "输入/文本(TextInput)",
            "pos": [
                800,
                409
            ],
            "size": [
                180,
                30
            ],
            "flags": {},
            "order": 4,
            "mode": 0,
            "outputs": [
                {
                    "name": "text",
                    "type": "text",
                    "links": [
                        28
                    ],
                    "slot_index": 0
                }
            ],
            "properties": {
                "text": "test"
            }
        }
    ],
    "links": [
        [
            3,
            7,
            0,
            8,
            0,
            "cmd"
        ],
        [
            4,
            6,
            0,
            7,
            0,
            "cmd"
        ],
        [
            5,
            6,
            1,
            7,
            1,
            "location"
        ],
        [
            6,
            5,
            0,
            6,
            1,
            "image"
        ],
        [
            8,
            1,
            0,
            9,
            0,
            "cmd"
        ],
        [
            11,
            11,
            0,
            9,
            1,
            "cmd"
        ],
        [
            15,
            9,
            0,
            14,
            0,
            "cmd"
        ],
        [
            17,
            14,
            0,
            15,
            0,
            "cmd"
        ],
        [
            22,
            17,
            0,
            15,
            2,
            "text"
        ],
        [
            23,
            14,
            1,
            15,
            1,
            "text"
        ],
        [
            24,
            15,
            0,
            6,
            0,
            "cmd"
        ],
        [
            25,
            15,
            1,
            18,
            0,
            "cmd"
        ],
        [
            26,
            8,
            0,
            13,
            0,
            "cmd"
        ],
        [
            27,
            13,
            0,
            10,
            0,
            "cmd"
        ],
        [
            28,
            19,
            0,
            13,
            1,
            "text"
        ]
    ],
    "groups": [],
    "config": {},
    "extra": {},
    "version": 0.4
};

let outputDefault = [
    {
        "code": 1,
        "data": [
            ""
        ],
        "id": 9,
        "name": "out",
        "type": [
            "基础/合并运行",
            "MultiMerge",
            "基础/合并运行(MultiMerge)"
        ]
    },
    {
        "code": 1,
        "data": [
            "",
            "",
            "",
            "",
            ""
        ],
        "id": 14,
        "name": "out",
        "type": [
            "编程/获取局部变量",
            "GetLocalVariables",
            "编程/获取局部变量(GetLocalVariables)"
        ]
    },
    {
        "code": 1,
        "data": [
            "",
            ""
        ],
        "id": 15,
        "name": "true",
        "type": [
            "编程/判断",
            "IfValid",
            "编程/判断(IfValid)"
        ]
    },
    {
        "code": 1,
        "data": [
            [],
            [
                828,
                1052
            ]
        ],
        "id": 6,
        "name": "out",
        "type": [
            "自动化/图片定位",
            "LocateOnScreenNode",
            "自动化/图片定位(LocateOnScreenNode)"
        ]
    },
    {
        "code": 1,
        "data": "",
        "id": 7,
        "name": "out",
        "type": [
            "模拟/鼠标移动",
            "MouseMove",
            "模拟/鼠标移动(MouseMove)"
        ]
    },
    {
        "code": 1,
        "data": "",
        "id": 8,
        "name": "out",
        "type": [
            "模拟/鼠标左键",
            "MouseLeft",
            "模拟/鼠标左键(MouseLeft)"
        ]
    },
    {
        "code": 1,
        "data": [
            ""
        ],
        "id": 13,
        "name": "out",
        "type": [
            "编程/配置局部变量",
            "SetLocalVariables",
            "编程/配置局部变量(SetLocalVariables)"
        ]
    },
    {
        "code": 1,
        "data": [
            "",
            "xw550"
        ],
        "id": 10,
        "name": "out",
        "type": [
            "基础/跳转运行",
            "JumpNode",
            "基础/跳转运行(JumpNode)"
        ]
    },
    {
        "code": 1,
        "data": [
            "",
            "xw550"
        ],
        "id": 11,
        "name": "out",
        "type": [
            "基础/跳转运行",
            "JumpNode",
            "基础/跳转运行(JumpNode)"
        ]
    },
    {
        "code": 1,
        "data": [
            ""
        ],
        "id": 9,
        "name": "out",
        "type": [
            "基础/合并运行",
            "MultiMerge",
            "基础/合并运行(MultiMerge)"
        ]
    },
    {
        "code": 1,
        "data": [
            "",
            "test",
            "",
            "",
            ""
        ],
        "id": 14,
        "name": "out",
        "type": [
            "编程/获取局部变量",
            "GetLocalVariables",
            "编程/获取局部变量(GetLocalVariables)"
        ]
    },
    {
        "code": 1,
        "data": [
            "",
            ""
        ],
        "id": 15,
        "name": "false",
        "type": [
            "编程/判断",
            "IfValid",
            "编程/判断(IfValid)"
        ]
    },
    {
        "code": 3,
        "data": [
            ""
        ],
        "id": 18,
        "name": "out",
        "type": [
            "基础/结束",
            "CMDEnd",
            "基础/结束(CMDEnd)"
        ]
    }
];