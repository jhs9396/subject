// export const ATTACK_DETECTION_PATTERN = (id) =>{
//     return {
        // 'kisa_ddei' : {
        //     "1":[
        //         {"gtype":"vertex","label":"kisa_ddei","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"kisa_ddei","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"kisa_ddei","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"attached","direction":"forward"},
        //         {"gtype":"vertex","label":"file","params":[]}
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"kisa_ddei","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ],
        //     "5":[
        //         {"gtype":"vertex","label":"kisa_ddei","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]}
        //     ],
        //     "6":[
        //         {"gtype":"vertex","label":"kisa_ddei","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ]
        // },
        // 'kisa_spamsniper' : {
        //     "1":[
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"attached","direction":"forward"},
        //         {"gtype":"vertex","label":"file","params":[]}
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "5":[
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]}
        //     ],
        //     "6":[
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ]
        // },
        // 'email' : {
        //     "1":[
        //         {"gtype":"vertex","label":"email","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"attached","direction":"forward"},
        //         {"gtype":"vertex","label":"file","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"email","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"email","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]}
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"email","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ],
        //     "5":[
        //         {"gtype":"vertex","label":"email","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "6":[
        //         {"gtype":"vertex","label":"email","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ],
        //     "7":[
        //         {"gtype":"vertex","label":"email","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]}
        //     ],
        //     "8":[
        //         {"gtype":"vertex","label":"email","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "9":[
        //         {"gtype":"vertex","label":"email","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ]
        // },
        // "file":  {
        //     "1":[
        //         {"gtype":"vertex","label":"file","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"attached","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]}
        //     ]
        // },
        // "url":  {
        //     "1":[
        //         {"gtype":"vertex","label":"url","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"url","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"url","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"url","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ],
        // },
        // "network_info":  {
        //     "1":[
        //         {"gtype":"vertex","label":"network_info","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"network_info","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"similar_to","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"network_info","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"similar_to","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"network_info","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ],
        //     "5":[
        //         {"gtype":"vertex","label":"network_info","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"similar_to","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ],
        //     "6":[
        //         {"gtype":"vertex","label":"network_info","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"similar_to","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //     ],
        // },
        // "kisa_waf":  {
        //     "1":[
        //         {"gtype":"vertex","label":"kisa_waf","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"kisa_waf","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"kisa_waf","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"kisa_waf","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ],
        //     "5":[
        //         {"gtype":"vertex","label":"kisa_waf","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"forward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ],
        // },
        // "indicator":  {
        //     "1":[
        //         {"gtype":"vertex","label":"indicator","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"indicator","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"indicator","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"indicator","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "5":[
        //         {"gtype":"vertex","label":"indicator","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ],
        //     "6":[
        //         {"gtype":"vertex","label":"indicator","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "7":[
        //         {"gtype":"vertex","label":"indicator","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"attached","direction":"forward"},
        //         {"gtype":"vertex","label":"file","params":[]}
        //     ],
        //     "8":[
        //         {"gtype":"vertex","label":"indicator","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]}
        //     ],
        //     "9":[
        //         {"gtype":"vertex","label":"indicator","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        // },
        // "intrusion_set":  {
        //     "1":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]}
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]}
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]}
        //     ],
        //     "5":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]}
        //     ],
        //     "6":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "7":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "8":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ],
        //     "9":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "10":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]}
        //     ],
        //     "11":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "12":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"forward"},
        //         {"gtype":"vertex","label":"attack_pattern","params":[]}
        //     ],
        //     "13":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"malware","params":[]}
        //     ],
        //     "14":[
        //         {"gtype":"vertex","label":"intrusion_set","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"has_indicator","direction":"forward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"attached","direction":"forward"},
        //         {"gtype":"vertex","label":"file","params":[]}
        //     ],
        // },
        // "attack_pattern":  {
        //     "1":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]}
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"malware","params":[]}
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]}
        //     ],
        //     "5":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]}
        //     ],
        //     "6":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"attached","direction":"forward"},
        //         {"gtype":"vertex","label":"file","params":[]}
        //     ],
        //     "7":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]}
        //     ],
        //     "8":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "9":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "10":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ],
        //     "11":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "12":[
        //         {"gtype":"vertex","label":"attack_pattern","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]}
        //     ]
        // },
        // "malware":  {
        //     "1":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]}
        //     ],
        //     "2":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]}
        //     ],
        //     "3":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"has_indicator","direction":"backward"},
        //         {"gtype":"vertex","label":"intrusion_set","params":[]},
        //         {"gtype":"edge","label":"use_attack_pattern","direction":"forward"},
        //         {"gtype":"vertex","label":"attack_pattern","params":[]}
        //     ],
        //     "4":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]}
        //     ],
        //     "5":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]}
        //     ],
        //     "6":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"attached","direction":"forward"},
        //         {"gtype":"vertex","label":"file","params":[]}
        //     ],
        //     "7":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_ddei","params":[]}
        //     ],
        //     "8":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_spamsniper","params":[]}
        //     ],
        //     "9":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]}
        //     ],
        //     "10":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "11":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"kisa_waf","params":[]}
        //     ],
        //     "12":[
        //         {"gtype":"vertex","label":"malware","params":[{name:'$id' , value: id, comp : '='}]},
        //         {"gtype":"edge","label":"indicates","direction":"backward"},
        //         {"gtype":"vertex","label":"indicator","params":[]},
        //         {"gtype":"edge","label":"indicates","direction":"forward"},
        //         {"gtype":"vertex","label":"url","params":[]},
        //         {"gtype":"edge","label":"contains","direction":"backward"},
        //         {"gtype":"vertex","label":"email","params":[]},
        //         {"gtype":"edge","label":"similar_to","direction":"backward"},
        //         {"gtype":"vertex","label":"network_info","params":[]}
        //     ]
        // },
        // "ioc": {
        //     "1": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []}
        //     ],
        //     "2": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []}
        //     ],
        //     "3": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "similar_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []}
        //     ],
        //     "4": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "similar_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []}
        //     ],
        //     "5": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "related_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []}
        //     ],
        //     "6": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "related_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []}
        //     ],
        //     "7": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "related_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []}
        //     ],
        //     "8": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "related_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []}
        //     ],
        //     "9": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "related_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        //     "10": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "related_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        //     "11": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "related_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        //     "12": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "related_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        //     "13": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "related_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        //     "14": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "related_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        //     "15": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        //     "16": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        //     "17": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "backward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        //     "18": [
        //         {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
        //         {"gtype": "edge", "label": "ref_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //         {"gtype": "edge", "label": "similar_to", "direction": "forward"},
        //         {"gtype": "vertex", "label": "ioc", "params": []},
        //     ],
        // }
        // }
    // }
// }
export const ATTACK_DETECTION_PATTERN = (id) => {
    return {
        "1": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []}
        ],
        "2": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []}
        ],
        "3": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "similar_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []}
        ],
        "4": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "similar_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []}
        ],
        "5": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "related_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []}
        ],
        "6": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "related_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []}
        ],
        "7": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "related_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []}
        ],
        "8": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "related_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []}
        ],
        "9": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "related_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ],
        "10": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "related_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ],
        "11": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "related_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ],
        "12": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "related_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ],
        "13": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "related_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ],
        "14": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "related_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ],
        "15": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ],
        "16": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ],
        "17": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "backward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ],
        "18": [
            {"gtype": "vertex", "label": "ioc", "params": [{name: '$id', value: id, comp: '='}]},
            {"gtype": "edge", "label": "ref_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
            {"gtype": "edge", "label": "similar_to", "direction": "forward"},
            {"gtype": "vertex", "label": "ioc", "params": []},
        ]
    }
}