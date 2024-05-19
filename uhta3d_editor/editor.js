/*
    editor
*/


var krpanoplugin = function () {
    var local = this; // save the 'this' pointer from the current plugin object

    local.name = "krpanoJS javascript plugin for editor";
    local.version = "19.05.2024 rev.1120";
    var krpano = null; // the krpano and plugin interface objects
    var plugin = null;

    // registerplugin - startup point for the plugin (required)
    // - krpanointerface = krpano interface object
    // - pluginpath = string with the krpano path of the plugin (e.g. "plugin[pluginname]")
    // - pluginobject = the plugin object itself (the same as: pluginobject = krpano.get(pluginpath) )
    local.registerplugin = function (krpanointerface, pluginpath, pluginobject) {
        krpano = krpanointerface;
        plugin = pluginobject;
        krpano.uhta3d_editor = plugin;
        // krpano.debugmode = false;
        // krpano.debugkeys = false;
        krpano.logkey = true;

        // add plugin attributes and functions
        // some example attributes:
        // plugin.registerattribute("tmp", {}, null, function () {
        //  log(plugin.tmp);
        // });       


        // register the size of the content
        // plugin.registercontentsize(window.innerWidth, window.innerHeight);
        plugin.registerattribute("version", local.version);

        // plugin.registerattribute("panos", []);

        // add a from xml callable functions:
        // plugin.showmodal = showmodal;


        // say hello
        // console.log(`uhta3d_preloadPano [v${local.version}] by Dmitriy Podrushnyak`);
        // krpano.call(`trace("uhta3d_preloadPano [v${local.version}] by Dmitriy Podrushnyak")`);

        init_plugin();
    };

    const init_plugin = () => {
        window.uhta3d_editor = new uhta3d_editor_class(); //.init();
        // console.log('uhta3d_editor :: init');
    }




    /** Класс редатора HS */
    class uhta3d_editor_class {
        version = local.version;
        isHSClickBlock = false;
        keyBlock = false;
        stylinghs_style = '*';
        align_offset = 0.5;

        constructor() {
            console.log('uhta3d_editor :: init');
            this.init();
        }

        init() {
            window.krpano = document.getElementById('krpanoSWFObject').get('global');
            this.stylinghs_style = '*';
            this.showAim();

            document.addEventListener('keydown', function (e) {
                if (!this.keyBlock) {
                    // console.log(e.code);
                    switch (e.code) {
                        case "Digit1":
                            krpano.view.architectural = 1;
                            console.log('Architectural view: On');
                            break;
                        case "Digit2":
                            krpano.view.architectural = 0;
                            console.log('Architectural view: Off');
                            break;
                        case "KeyA":
                            uhta3d_editor.align(uhta3d_editor.align_offset * 1);
                            break;
                        case "KeyD":
                            uhta3d_editor.align(uhta3d_editor.align_offset * -1);
                            break;
                        case "KeyW":
                            // uhta3d_editor.setPanoNorth();
                            break;
                        case "KeyS":
                            uhta3d_editor.align_save();
                            break;
                        case "KeyQ":
                            uhta3d_editor.step1_modal();
                            console.log('link start');
                            break;
                        case "KeyE":
                            uhta3d_editor.step2();
                            break;
                        case "KeyR":
                            uhta3d_editor.startRemoveHS();
                            console.log('remove start..');
                            break;
                        case "KeyT":
                            uhta3d_editor.stophRemoveHS();
                            console.log('remove finish!');
                            break;
                        case "KeyF":
                            uhta3d_editor.startStylingHS();
                            console.log('styling start..');
                            break;
                        case "KeyG":
                            uhta3d_editor.stopStylingHS();
                            console.log('styling finish!');
                            break;
                        case "KeyH":
                            uhta3d_editor.startStylingHS_modal();
                            console.log('select style for HS..');
                            break;
                        case "KeyC":
                            uhta3d_editor.getAllScenesFromKrpano();
                            console.log('save all changes..');
                            break;
                        case "Esc":
                            if (uhta3d_editor.is_step1) {
                                uhta3d_editor.is_step1 = false;
                                console.log('step 1 :: cancel!');
                            }
                            break;
                    }
                }
            });
            this.getHelp();

            let curscene = {
                'name': krpano.xml.scene,
                'ath': krpano.view.hlookat,
                'atv': krpano.view.vlookat,
                'fov': krpano.view.fov,
                'prealign': krpano.image.prealign,
            };
            krpano.actions.loadpano('scenes.xml');
            krpano.actions.loadscene(curscene.name, `view.hlookat=${curscene.ath}&view.vlookat=${curscene.atv}&view.fov=${curscene.fov}`);
        }


        // to180(p) {
        //     return (p * 1 - (p > 180 ? 180 : 0)) % 360;
        // }
        // to90(p) {
        //     return (p * 1 - (p > 90 ? 90 : 0)) % 180;
        // }

        /** Вывод справки в консоль */
        getHelp() {
            console.log(`
Editor's help:
    Vertical alignment:
        Digit 1/2 - Architectural view: On/Off
        A/D - panorama rotation -/+ in degrees
        S - save panorama rotation for current scene
    Hotspot editor:
        Q - link start
        Е - link stop
        R - remove start
        T - remove stop
        F - styling start
        G - styling stop
        H - select style hs
    Save all changes:
        C - save all to xml
        `);
        }

        /** Выровнять панораму */
        align(deg) {
            let d = krpano.image.prealign ? krpano.image.prealign.split('|') : '0|0|0'.split('|');
            // krpano.view.architectural = true;
            let lx = Math.sin(Math.PI / 180 * krpano.view.hlookat);
            let lz = Math.cos(Math.PI / 180 * krpano.view.hlookat);
            krpano.image.prealign = `${(d[0] * 1 + deg * 1 * lx).toFixed(3) * 1 + 0.00001}|${0 + 0.00001}|${(d[2] * 1 + deg * 1 * lz).toFixed(3) * 1 + 0.00001}`;
            // console.log('deg:', krpano.view.hlookat);
            // console.log('x:', lx, deg * lx, '\nz:', lz, deg * lz);
            // console.log('prealign:', krpano.image.prealign);
        }

        /** Установка сервера панорамы */
        #setPanoNorth(deg) {
            deg = deg ? deg : krpano.view.hlookat;

            let pr = krpano.image.prealign ? krpano.image.prealign.split('|') : [0.00001, 0.00001, 0.00001];
            pr[1] -= deg + 0.00001;
            krpano.image.prealign = pr.join('|');
            krpano.view.hlookat = 0;

            krpano.hotspot.getArray().forEach(hs => {
                hs.tmp_ath = typeof hs.tmp_ath == 'undefined' ? hs.ath : hs.tmp_ath;
                // hs.ath = hs.tmp_ath - deg;
                hs.ath -= deg;
                hs.linkedscene_hoffset = hs.linkedscene_hoffset * 1 + deg;
                // console.log(hs.linkedscene_hoffset);
            })
            // this.copyToClipboard(` prealign="${krpano.image.prealign}"`);
            console.log(`prealign="${krpano.image.prealign}"`);

            this.align_save();
        }

        /** Сохранение prealign */
        align_save() {
            let curscene = {
                'name': krpano.xml.scene,
                'ath': krpano.view.hlookat,
                'atv': krpano.view.vlookat,
                'fov': krpano.view.fov,
                'prealign': krpano.image.prealign,
            };

            // только первый раз загрузить scenes.xml
            // krpano.actions.loadpano('scenes.xml');
            // krpano.actions.loadscene(curscene.name, `view.hlookat=${curscene.ath}&view.vlookat=${curscene.atv}&view.fov=${curscene.fov}`);

            let xml = new DOMParser();
            let sc = krpano.scene.getItem(krpano.xml.scene);
            let dom = xml.parseFromString(krpano.xml.filecontent, 'text/xml');
            let sc_xml = dom.querySelector(`scene[name="${sc.name}"]`);
            let img = dom.querySelector(`scene[name="${sc.name}"] image`);

            /* обновление prealign */
            img.setAttribute('prealign', curscene.prealign);
            // uhta3d_editor.reloadXml(`<krpano>${new XMLSerializer().serializeToString(sc_xml)}</krpano>`);

            /* обновление hotspots */
            let hotspot = sc_xml.querySelectorAll('hotspot')
            hotspot.forEach(i => {
                // console.log(i.getAttribute('name'), i.getAttribute('ath'), i.getAttribute('linkedscene_hoffset'));

                let hs = krpano.hotspot.getItem(i.getAttribute('name'));
                // console.log((hs.linkedscene_hoffset * 1).toFixed(2));
                i.setAttribute('ath', hs.ath.toFixed(3));
                i.setAttribute('linkedscene_hoffset', (hs.linkedscene_hoffset * 1).toFixed(3));

                // console.log(i.getAttribute('name'), i.getAttribute('ath'), i.getAttribute('linkedscene_hoffset'));
            })

            /* применение изменений */
            uhta3d_editor.reloadXml(sc_xml.outerHTML);
            /* выключен архитектурный вид */
            console.log('Architectural view: Off');
        }

        /** Загрузка сцены */
        loadscene(name) {
            krpano.actions.loadscene(name);
        }

        /**
         * Получение и форматирование сцен в xml
         * @param {string} text_xml 
         */
        getAllScenes(text_xml) {
            /* все споты */
            let text = '', tmp_hs = [], tmp_hs_xml = [], hs_arr = [];
            let curscene = {
                'name': krpano.xml.scene,
                'ath': krpano.view.hlookat,
                'atv': krpano.view.vlookat,
            };
            let xml = new DOMParser();
            let sc_tmp = xml.parseFromString("<krpano>" + text_xml + "</krpano>", 'text/xml').getElementsByTagName('scene');
            Object.entries(sc_tmp).forEach(sc => {
                sc = sc[1];
                let sc_name = sc.getAttribute('name').replace('scene_', '');

                tmp_hs[sc_name] = [];
                tmp_hs_xml[sc_name] = [];
                hs_arr = sc.getElementsByTagName('hotspot');
                Object.entries(hs_arr).forEach(hs => {
                    hs = hs[1];
                    let linksc = hs.getAttribute('linkedscene').replace('scene_', '');
                    hs.setAttribute('name', `spot_${sc_name}_${linksc}`);
                    hs.setAttribute('linkedscene_hoffset', (hs.getAttribute('linkedscene_hoffset') * 1).toFixed(3));
                    tmp_hs[sc_name].push(new XMLSerializer().serializeToString(hs));
                    tmp_hs_xml[sc_name].push(hs);
                })
                // Object.entries(hs_arr).forEach(hs => {
                //     sc.removeChild(hs[1]);
                //     console.log(`remove ${hs[1].getAttribute('name')} from ${sc_name}`);
                // })
                // Object.entries(tmp_hs_xml[sc_name]).forEach(i => {
                //     sc.appendChild(i[1]);
                //     console.log(`append ${i[1].getAttribute('name')} to ${sc_name}`);
                // })
                text += new XMLSerializer().serializeToString(sc);
            });
            // text.replace(/\r?\n|\r|\t/g, '');
            let xml_text = "<krpano>\n\t" + text + "\n</krpano>";
            this.copyToClipboard(xml_text);
            console.log('getAllScenes :: xml generated');
            krpano.actions.loadxml(xml_text);
            krpano.actions.loadscene(curscene.name, `view.hlookat=${curscene.ath}&view.vlookat=${curscene.atv}`);
            this.saveFile(xml_text, 'scenes.xml');
        }

        /**
         * Получение сцен из krpano
         */
        getAllScenesFromKrpano() {

            let text_xml = '';
            krpano.scene.getArray().forEach(sc => {
                text_xml += `<scene name="${sc.name}" title="${sc.title}" onstart="${sc.onstart}" thumburl="${sc.thumburl}" lat="${sc.lat}" lng="${sc.lng}" alt="${sc.alt}" heading="${sc.heading}">${sc.content}</scene>`;
            })
            console.log('getAllScenesFromKrpano :: scenes are obtained');
            text_xml = text_xml.replaceAll('\n', '').replaceAll('\t', '');


            /* все споты */
            let text = '', tmp_hs = [], tmp_hs_xml = [], hs_arr = [];
            let curscene = {
                'name': krpano.xml.scene,
                'ath': krpano.view.hlookat,
                'atv': krpano.view.vlookat,
            };
            let xml = new DOMParser();
            let sc_tmp = xml.parseFromString("<krpano>" + text_xml + "</krpano>", 'text/xml').getElementsByTagName('scene');
            Object.entries(sc_tmp).forEach(sc => {
                sc = sc[1];
                let sc_name = sc.getAttribute('name').replace('scene_', '');

                tmp_hs[sc_name] = [];
                tmp_hs_xml[sc_name] = [];
                hs_arr = sc.getElementsByTagName('hotspot');
                Object.entries(hs_arr).forEach(hs => {
                    hs = hs[1];
                    let linksc = hs.getAttribute('linkedscene').replace('scene_', '');
                    hs.setAttribute('name', `spot_${sc_name}_${linksc}`);
                    hs.setAttribute('linkedscene_hoffset', (hs.getAttribute('linkedscene_hoffset') * 1).toFixed(3));
                    tmp_hs[sc_name].push(new XMLSerializer().serializeToString(hs));
                    tmp_hs_xml[sc_name].push(hs);
                })
                // Object.entries(hs_arr).forEach(hs => {
                //     sc.removeChild(hs[1]);
                //     console.log(`remove ${hs[1].getAttribute('name')} from ${sc_name}`);
                // })
                // Object.entries(tmp_hs_xml[sc_name]).forEach(i => {
                //     sc.appendChild(i[1]);
                //     console.log(`append ${i[1].getAttribute('name')} to ${sc_name}`);
                // })
                text += new XMLSerializer().serializeToString(sc);
            });

            let xml_text = "<krpano>\n\t" + text + "\n</krpano>";
            this.copyToClipboard(xml_text);
            console.log('getAllScenes :: xml generated');
            krpano.actions.loadxml(xml_text);
            krpano.actions.loadscene(curscene.name, `view.hlookat=${curscene.ath}&view.vlookat=${curscene.atv}`);

            // return true;

            this.saveFile(xml_text, 'scenes.xml');
            // this.clearHsClone();
        }

        /** Список всех сцен */
        getAllScenesName() {
            return krpano.scene.getArray().map(i => i.name);
        }
        /** Список всех хотспотов в сцене */
        getAllHotspotInScene() {
            return Object.entries(new DOMParser().parseFromString(krpano.xml.content, 'text/xml').getElementsByTagName('hotspot')).map(i => i[1].getAttribute('name'));
        }

        /**
         * Удалить копии хотспотов 
         * @param {boolean} save    Необходимость сохранения
         */
        clearHsClone(save) {
            if (typeof save !== 'boolean') {
                save = true;
            }
            let cursc = krpano.xml.scene;
            krpano.actions.loadpano('scenes.xml');
            uhta3d_editor.loadscene(cursc);

            let xml = new DOMParser();
            let doc = xml.parseFromString(`${krpano.xml.filecontent}`, 'text/xml');
            let isChanged = false;
            let tmp_hs = [];

            doc.querySelectorAll('scene').forEach(sc => {
                if (sc.querySelectorAll('hotspot').length > 1) {
                    tmp_hs[sc.getAttribute('name')] = [];
                    // console.log(sc.getAttribute('name'));
                    // console.log("\thotspot:", sc.querySelectorAll('hotspot').length);
                    sc.querySelectorAll('hotspot').forEach(hs => {
                        // let isClone = false;
                        let p_hs_name = hs.getAttribute('name');
                        if (tmp_hs[sc.getAttribute('name')].indexOf(p_hs_name) > -1) {
                            isChanged = true;
                            // isClone = true;
                            let hs_remove = doc.querySelector(`hotspot[name="${p_hs_name}"]`);
                            hs_remove.parentNode.removeChild(hs_remove);
                            console.log(`remove ${p_hs_name}`);
                        } else {
                            tmp_hs[sc.getAttribute('name')].push(p_hs_name);
                        }
                        // console.log("\t\t", p_hs_name, isClone ? '*' : '');
                        // isClone ? console.log(`\t\tremove hs[${p_hs_name}]`) : '';
                    })
                }
            })

            if (save) {
                if (isChanged) {
                    this.saveFile(new XMLSerializer().serializeToString(doc).replaceAll('\n', '').replaceAll('\t', ''), 'scenes.xml');
                    console.log('clearHsClone :: reload pages after saving!');
                    // window.location.reload();
                } else {
                    console.log('clearHsClone :: all is fine!');
                }
            }
            console.log('clearHsClone :: Done!');
            tmp_hs = null;

            // krpano.actions.loadpano('scenes.xml');
            // uhta3d_editor.loadscene(cursc);
            this.reloadScene();
        }

        /** Загрузка из xml */
        reloadXml(xml) {
            let curscene = {
                'name': krpano.xml.scene,
                'ath': krpano.view.hlookat,
                'atv': krpano.view.vlookat,
                'fov': krpano.view.fov,
            };
            krpano.actions.loadxml('<krpano>' + xml + '</krpano>');
            krpano.actions.loadscene(curscene.name, `view.hlookat=${curscene.ath}&view.vlookat=${curscene.atv}&view.fov=${curscene.fov}`);
        }

        /* Перезагрузка тура */
        reloadScene() {
            let curscene = {
                'name': krpano.xml.scene,
                'ath': krpano.view.hlookat,
                'atv': krpano.view.vlookat,
                'fov': krpano.view.fov,
            };
            krpano.actions.loadscene(curscene.name, `view.hlookat=${curscene.ath}&view.vlookat=${curscene.atv}&view.fov=${curscene.fov}`);
        }

        /** Перезагрузка полностью всего тура */
        reloadTour() {
            let curscene = {
                'name': krpano.xml.scene,
                'ath': krpano.view.hlookat,
                'atv': krpano.view.vlookat,
                'fov': krpano.view.fov,
            };
            window.location.href = `?startscene=${curscene.name}&startlookat=${curscene.ath},${curscene.atv},fov=${curscene.fov}`;
        }

        /** Создание hotspot */
        addHotspot(name, ath, atv, offset) {
            let curscene = {
                'name': krpano.xml.scene,
                'ath': krpano.view.hlookat,
                'atv': krpano.view.vlookat,
                'fov': krpano.view.fov,
            };
            let linkedscene = '', linkedscene_hoffset = '';

            if (name === '') {
                let linksc = prompt('link to new scene (name_scane,hoffset)');
                linkedscene = linksc.split(',')[0];
                linkedscene_hoffset = linksc.split(',')[1] ? linksc.split(',')[1] : 0;
            } else {
                linkedscene = name;
                linkedscene_hoffset = offset ? offset : 0;
            }
            // console.log(linkedscene, linkedscene_hoffset);

            let t = krpano.addhotspot(`spot_${curscene.name.replace('scene_', '')}_${linkedscene.replace('scene_', '')}`);
            t.loadstyle('skin_hotspotstyle');
            t.ath = ath ? ath.toFixed(3) : krpano.view.hlookat.toFixed(3);
            t.atv = atv ? atv.toFixed(3) : krpano.view.vlookat.toFixed(3);
            t.linkedscene = linkedscene;
            t.linkedscene_hoffset = linkedscene_hoffset.toFixed(3);
            // t.rotate = 0;


            let xml = new DOMParser();
            let sc = krpano.scene.getItem(krpano.xml.scene);

            let scene_xml = xml.parseFromString(`<scene name="${sc.name}" title="${sc.title}" onstart="${sc.onstart}" thumburl="${sc.thumburl}" lat="${sc.lat}" lng="${sc.lng}" alt="${sc.alt}" heading="${sc.heading}">` + sc.content + '\n</scene>', 'text/xml').getElementsByTagName('scene')[0];

            /* remove old hs */
            scene_xml.querySelectorAll(`hotspot[name=${t.name}]`).forEach(hs => {
                // console.log(`remove ${hs}`);
                hs.parentNode.removeChild(hs);
            });
            // console.log(`after remove "${t.name}"`, scene_xml);
            // sc.content = scene_xml;

            /* append new hs */
            scene_xml.appendChild(xml.parseFromString(`<hotspot name="${t.name}" tooltip="${krpano.scene.getItem(t.linkedscene).title}" style="skin_hotspotstyle" ath="${t.ath}" atv="${t.atv}" linkedscene="${t.linkedscene}" linkedscene_hoffset="${t.linkedscene_hoffset}" use3dtransition="true" />`, 'text/xml').getElementsByTagName('hotspot')[0]);

            /* update tour */
            krpano.actions.loadxml('<krpano>' + new XMLSerializer().serializeToString(scene_xml) + '</krpano>');
            krpano.actions.loadscene(curscene.name, `view.hlookat=${curscene.ath}&view.vlookat=${curscene.atv}&view.fov=${curscene.fov}`);
        }
        /** Создание HS step1 с модальным окном*/
        step1_modal() {
            this.keyBlock = true;
            console.log('step 1 :: Select a scene name...');

            let scene_list_dom = '';
            let scene_list = krpano.scene.getArray().map(i => i.name).filter(i => i !== krpano.xml.scene);
            scene_list.forEach(i => {
                scene_list_dom += `<option value="${i}"></option>`;
            })
            bs_modal.openmodal('title', `Enter scane name: <input id="select_sc" list="select_sc_ds" class="w-100"><datalist id="select_sc_ds">${scene_list_dom}</datalist>`, null, 'ок');
            setTimeout(() => document.getElementById('select_sc').focus(), 500);
            document.getElementById('select_sc').addEventListener('keydown', function (e) {
                if (['Enter', 'NumpadEnter'].indexOf(e.code) > -1) {
                    if (scene_list.indexOf(this.value) > -1) {
                        uhta3d_editor.step1(this.value);
                        bs_modal.closemodal();
                    } else {
                        bs_modal.closemodal();
                        alert(`Scene "${this.value}" not found!`);
                        setTimeout(() => uhta3d_editor.step1_modal(), 300);
                    }
                }
            });
            this.addEventToModal();
        }

        is_step1 = false;

        /** Создание HS шаг 1 */
        step1(sc) {
            this.is_step1 = true;
            window.vh1 = krpano.view.hlookat;
            window.vv1 = krpano.view.vlookat;
            window.sc_name_1 = krpano.xml.scene;
            window.sc_name_2 = sc;
            krpano.actions.loadscene(sc_name_2);
        }

        /** Создание HS шаг 2 */
        step2() {
            if (this.is_step1) {
                let vh1 = window.vh1;
                let vh2 = krpano.view.hlookat;
                let vv2 = krpano.view.vlookat;
                let offset = vh1 - vh2;
                let sc_name_1 = window.sc_name_1;
                let sc_name_2 = krpano.xml.scene;
                krpano.view.hlookat = vh2;
                if (krpano.hotspot.getItem(sc_name_1)) {
                    krpano.removehotspot(sc_name_1);
                }
                this.addHotspot(sc_name_1, vh2, vv2, offset * 1 + 180);
                krpano.actions.loadscene(sc_name_1, null, 'MERGE', 'NOBLAND', function () {
                    if (krpano.hotspot.getItem(sc_name_2)) {
                        krpano.removehotspot(sc_name_2);
                    }
                    krpano.view.hlookat = vh1;
                    uhta3d_editor.addHotspot(sc_name_2, vh1, vv1, offset * -1 + 180);
                });
                this.is_step1 = false;
                console.log('step2 :: link done');
            } else {
                alert('First you have to press "Q"!');
            }
        }

        /** Удаление HS */
        startRemoveHS() {
            krpano.hotspot.getArray().filter(i => i.linkedscene).forEach(i => {
                // console.log(i.onclick);
                i.onclick_back = i.onclick;
                i.onclick = function () {
                    // console.log('del ' + i.name + '?')
                    uhta3d_editor.removeHS(i.name);
                }
            });
        }
        stophRemoveHS() {
            krpano.hotspot.getArray().filter(i => i.linkedscene).forEach(i => {
                // console.log(i.onclick);
                i.onclick = i.onclick_back;
                delete i.onclick_back;
            });
        }
        removeHS(p_hs_name) {
            let xml = new DOMParser();
            let sc = krpano.scene.getItem(krpano.xml.scene);
            let ath = krpano.view.hlookat;
            let atv = krpano.view.vlookat;
            let scene_xml = xml.parseFromString(`<scene name="${sc.name}" title="${sc.title}" onstart="${sc.onstart}" thumburl="${sc.thumburl}" lat="${sc.lat}" lng="${sc.lng}" alt="${sc.alt}" heading="${sc.heading}">` + sc.content + '\n</scene>', 'text/xml').getElementsByTagName('scene')[0];

            Object.entries(scene_xml.getElementsByTagName('hotspot')).forEach(h => {
                if (h[1].getAttribute('name') == p_hs_name) {
                    scene_xml.removeChild(h[1]);
                    console.log(`hs[${p_hs_name}] deleted`);
                }
            });

            krpano.actions.loadxml('<krpano>' + new XMLSerializer().serializeToString(scene_xml) + '</krpano>');
            krpano.actions.loadscene(sc.name, `view.hlookat=${ath}&view.vlookat=${atv}`);
        }


        /** Стиль HS */
        setStylingHS() {
            let style_arr = krpano.style.getArray().map(i => i.name);
            // style_arr.forEach(i => console.log(i));
            this.stylinghs_style = prompt('Select a style name or * for a standard style:');  // hs_zigzag, hs_l2
            if (style_arr.indexOf(this.stylinghs_style) == -1 && this.stylinghs_style !== '*') {
                alert(`Style "${this.stylinghs_style}" not found!`);
                this.setStylingHS();
                console.clear();
            }
            console.clear();
        }
        startStylingHS_modal() {
            this.keyBlock = true;

            let style_list_dom = '';
            let style_list = krpano.style.getArray().map(i => i.name);
            style_list.forEach(i => {
                style_list_dom += `<option value="${i}"></option>`;
            })
            bs_modal.openmodal('title', `Enter style name: <input id="select_style" list="select_style_ds" class="w-100"><datalist id="select_style_ds">${style_list_dom}</datalist>`, null, 'ок');
            setTimeout(() => document.getElementById('select_style').focus(), 500);
            document.getElementById('select_style').addEventListener('keydown', function (e) {
                if (['Enter', 'NumpadEnter'].indexOf(e.code) > -1) {
                    if (style_list.indexOf(this.value) > -1 || this.value == '*') {
                        uhta3d_editor.stylinghs_style = this.value;
                        bs_modal.closemodal();
                    } else {
                        bs_modal.closemodal();
                        alert(`Style "${this.value}" no found!`);
                        setTimeout(() => uhta3d_editor.startStylingHS_modal(), 300);
                    }
                }
            });
            this.addEventToModal();
        }
        startStylingHS() {
            if (this.stylinghs_style !== '' || this.stylinghs_style == '*') {
                krpano.hotspot.getArray().filter(i => i.linkedscene).forEach(i => {
                    // console.log(i.onclick);
                    i.onclick_back = i.onclick;
                    i.onclick = function () {
                        // console.log('del ' + i.name + '?')
                        uhta3d_editor.stylingHS(i.name);
                    }
                });
            } else {
                console.log('stylinghs :: No style is set for styling!');
                this.setStylingHS();
                this.startStylingHS();
            }
        }
        stopStylingHS() {
            krpano.hotspot.getArray().filter(i => i.linkedscene).forEach(i => {
                // console.log(i.onclick);
                i.onclick = i.onclick_back;
                delete i.onclick_back;
            });
        }
        stylingHS(p_hs_name) {
            let xml = new DOMParser();
            let sc = krpano.scene.getItem(krpano.xml.scene);
            let ath = krpano.view.hlookat;
            let atv = krpano.view.vlookat;
            let fov = krpano.view.fov;
            let scene_xml = xml.parseFromString(`<scene name="${sc.name}" title="${sc.title}" onstart="${sc.onstart}" thumburl="${sc.thumburl}" lat="${sc.lat}" lng="${sc.lng}" alt="${sc.alt}" heading="${sc.heading}">` + sc.content + '\n</scene>', 'text/xml').getElementsByTagName('scene')[0];

            krpano.hotspot.getItem(p_hs_name).loadstyle(this.stylinghs_style);
            Object.entries(scene_xml.getElementsByTagName('hotspot')).forEach(h => {
                if (h[1].getAttribute('name') == p_hs_name) {
                    h[1].setAttribute('style', 'skin_hotspotstyle|' + this.stylinghs_style);
                    console.log(`hs[${p_hs_name}] "${this.stylinghs_style}" style applied!`);
                }
            });

            krpano.actions.loadxml('<krpano>' + new XMLSerializer().serializeToString(scene_xml) + '</krpano>');
            krpano.actions.loadscene(sc.name, `view.hlookat=${ath}&view.vlookat=${atv}&view.fov=${fov}`);
        }

        /** Отображение перекрестия */
        showAim() {
            let l = krpano.addlayer();
            l.keep = true;
            l.align = 'center';
            l.scale = 0.5;
            l.capture = false;
            // l.url = './plugins/uhta3d_editor/aim.png';
            l.url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAABJmlDQ1BBZG9iZSBSR0IgKDE5OTgpAAAoz2NgYDJwdHFyZRJgYMjNKykKcndSiIiMUmA/z8DGwMwABonJxQWOAQE+IHZefl4qAwb4do2BEURf1gWZxUAa4EouKCoB0n+A2CgltTiZgYHRAMjOLi8pAIozzgGyRZKywewNIHZRSJAzkH0EyOZLh7CvgNhJEPYTELsI6Akg+wtIfTqYzcQBNgfClgGxS1IrQPYyOOcXVBZlpmeUKBhaWloqOKbkJ6UqBFcWl6TmFit45iXnFxXkFyWWpKYA1ULcBwaCEIWgENMAarTQZKAyAMUDhPU5EBy+jGJnEGIIkFxaVAZlMjIZE+YjzJgjwcDgv5SBgeUPQsykl4FhgQ4DA/9UhJiaIQODgD4Dw745AMDGT/0ZOjZcAAAACXBIWXMAABcSAAAXEgFnn9JSAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA0LTIxVDIzOjMyOjE5KzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTA0LTIxVDIzOjMyOjE5KzAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNC0yMVQyMzozMjoxOSswMzowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNzc1NmVjOC02OTgwLWIwNGMtYWIwYS1mNjY1ZWIwN2EyYjYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplYmVmYzZjOC00NjMxLTBkNDctOTUxMC0zNzQ2NmMzOGE5MjMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZDA0YmRmNy0yOTViLTA1NGMtODU0Yy0xNDhlNjZkZDkyNTAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2ZDA0YmRmNy0yOTViLTA1NGMtODU0Yy0xNDhlNjZkZDkyNTAiIHN0RXZ0OndoZW49IjIwMjQtMDQtMjFUMjM6MzI6MTkrMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Mzc3NTZlYzgtNjk4MC1iMDRjLWFiMGEtZjY2NWViMDdhMmI2IiBzdEV2dDp3aGVuPSIyMDI0LTA0LTIxVDIzOjMyOjE5KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bphc5gAABJhJREFUeNrt3LFO21ocwOFjFGfJZgndK9ZudKjEkgyoD5AnKXvfhTfxAyAWFkY2VtQKyVuXJML3794QtdRISQDXJN8nHcVD7OH4/LCrxh7UdZ2A3TYwBSB0QOiA0AGhA0IHhA4IHRA6CB0QOiB0QOiA0AGhA0IHhA5CB4QOCB0QOiB0QOiA0AGhg9ABoQNCB4QOCB0QOiB0QOiA0EHogNABoQNCB4QOCB0QOiB0EDogdEDogNDfSJZlzuKfPsQ4i3G6wTlexLiMcR7jdl8mqq5rofMufY5Rxhhtse84xpcY0xgXplLo9Nf5lpE/Gi2P8dFUCt2tWz//GVPEx3GzXRRFKssyDQbrneLFYpGm02mqqiotj1HE3FQSETr9M1xtDIdpPB5vtvNw2HoshE7PblB+vVOZz+cpz/O1dmy+++TupjadQgeEDggdEDogdEDogNBB6IDQAaEDQgeEDggdEDogdBA6IHRA6IDQAaEDQgeEDggdEDoIHRA6IHRA6IDQAaEDQgeEDkIHhA4IHRA6IHRA6IDQAaGD0AGhA0IHhA4IHRA6IHRA6IDQQeiA0AGhA0IHhA4IHRA6IHQQOiB0QOiA0AGhA0IH9jz0Ika+zY5ZllkFz8/NP2Yhzeu6roT+dxfi5/g4j3FsPb66b6Zgtc5u4uMsgr8QeveT/yE+yhgjS7HlMjSfd7LPnmguJGWsuU8R+63Qu3X2GHlRFCnPc8vxF4eHhxvvc3R0ZB5b/vhV1c8799FyzX0VerdOHzfKskwnJydW5RObRNt89/r62qQ90czJZDL5Y80JvTvD1cZw6ErU8R+GfdGsrbY1J/TuPKw2Hh6sSN5mkf2+th6EDggdEDogdEDogNBB6IDQe+xgtXFw4EzyNovs97V1IPTuzVYbs5kHMlps+ks3c9iyyGaz1jUn9O5cxhg3G9Pp1M83n2geaml+p73uvDSRN88L3N/fm7zn//hdCr17zXPoX2KMlk8X8cKr893dXTKXz/qxXHNC71LzXHCWZdPkxROvctu+7T574vHFE7dC/zuxX0TsH9MLXiW1g17rzTD/msr/b468Sqo/tj4RcRJ3ZkW+9jveYm6+63w3+H90EDogdEDogNABoQNCB4QOCB2EDggdEDogdEDogNABoQNCB6EDQgeEDggdEDogdEDogNBB6KYAhA4IHRA6IHRA6IDQAaEDQgehA0IHhA4IHRA6IHRA6IDQQeiA0AGhA0IHhA4IHRA6IHQQOiB0QOiA0AGhA0IHhA4IHRA6CB0QOiB0QOiA0HmBbLWRZSnP87V3bL7b7NN2LIROv8xWG7NZurq6SoPBeqd4sVj83KftWAj9/V8Cs526cFUxbmIcV1WVJpPJtsdpjlHt2Ny0quta6LxLZzHKGKMt9/+xPAZCp8cuYnxaxnq6wTlexLiMcR7j1jQK3a1X/zWhfjUNuKKD0AGhA0IHhA4IHRA6IHRA6CB0QOiA0AGhA0IHhA4IHRA6CB0QOiB0QOiA0AGhA0IHhA4IHYQOCB0QOiB0QOiA0AGhA0IHoQNCB4QOCB0QOiB0QOiA0EHogNABoQO99x94nMslrgOoxQAAAABJRU5ErkJggg==";

            /* добавление списка сцен */
            this.sc_list = {};
            krpano.scene.getArray().map(i => i.name).forEach(i => this.sc_list[i.replace('scene_', '')] = i);
        }

        /** Сохранение файла */
        saveFile(xml, fname) {
            let file = new Blob([xml], { type: 'plain/text' });
            let a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = fname;
            a.click();
        }

        /** Добавление события на закрытие модальной формы */
        addEventToModal() {
            document.getElementById('editor_modal').addEventListener('hide.bs.modal', () => {
                uhta3d_editor.keyBlock = false;
                // console.log('keyBlock = false');
                console.log('The operation has been canceled!');
            });
        }

        /** Копирование в буфер обмена */
        copyToClipboard(o) { if (window.clipboardData && window.clipboardData.setData) return window.clipboardData.setData("Text", o); if (document.queryCommandSupported && document.queryCommandSupported("copy")) { var t = document.createElement("textarea"); t.textContent = o, t.style.position = "fixed", document.body.appendChild(t), t.select(); try { return document.execCommand("copy") } catch (t) { return console.warn("Copy to clipboard failed.", t), prompt("Copy to clipboard: Ctrl+C, Enter", o) } finally { document.body.removeChild(t) } } }
    }







    /**
     * Вывод в консоль
     * @param {type} name
     * @param {type} str
     * @returns {undefined}
     */
    function log(name, str) {
        if (plugin.log === 'true' || plugin.log == "1") {
            str ? console.log(name + ': ', str) : console.log(name);
        }
    }
    function logClear() {
        if (plugin.log === 'true' || plugin.log == "1") {
            console.clear();
        }
    }


    // unloadplugin - end point for the plugin (optionally)
    // - will be called from krpano when the plugin will be removed
    // - everything that was added by the plugin (objects,intervals,...) should be removed here
    local.unloadplugin = function () {
        plugin = null;
        krpano = null;
    }
}

