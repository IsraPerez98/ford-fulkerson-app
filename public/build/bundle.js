
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function getAllContexts() {
        return get_current_component().$$.context;
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to separate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        SvelteComponentTyped: SvelteComponentTyped,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getAllContexts: getAllContexts,
        getContext: getContext,
        hasContext: hasContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules/svelte-simple-modal/src/Modal.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1, window: window_1$1 } = globals;
    const file$o = "node_modules/svelte-simple-modal/src/Modal.svelte";

    // (423:0) {#if Component}
    function create_if_block$7(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div0_class_value;
    	let div1_class_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let div2_class_value;
    	let div3_class_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[1].closeButton && create_if_block_1$5(ctx);
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"));
    			attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			add_location(div0, file$o, 467, 8, 11882);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"));
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null);
    			attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			add_location(div1, file$o, 438, 6, 10907);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"));
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			add_location(div2, file$o, 432, 4, 10774);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"));
    			attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			add_location(div3, file$o, 423, 2, 10528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[49](div1);
    			/*div2_binding*/ ctx[50](div2);
    			/*div3_binding*/ ctx[51](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[13])) /*onOpen*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[14])) /*onClose*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[15])) /*onOpened*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[16])) /*onClosed*/ ctx[16].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[1].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 512) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_label_value !== (div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null)) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 256) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 128) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 64) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[49](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[50](null);
    			/*div3_binding*/ ctx[51](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(423:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (454:8) {#if state.closeButton}
    function create_if_block_1$5(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$3, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 2) show_if = null;
    		if (show_if == null) show_if = !!/*isFunction*/ ctx[17](/*state*/ ctx[1].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(454:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (457:10) {:else}
    function create_else_block$6(ctx) {
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"));
    			attr_dev(button, "aria-label", "Close modal");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			attr_dev(button, "type", "button");
    			toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			add_location(button, file$o, 457, 12, 11603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*cssCloseButton*/ 1024) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(457:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (455:10) {#if isFunction(state.closeButton)}
    function create_if_block_2$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[1].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[18] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[1].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(455:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[2] && create_if_block$7(ctx);
    	const default_slot_template = /*#slots*/ ctx[48].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[47], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1$1, "keydown", /*handleKeydown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[47],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[47])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[47], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bind(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;

    	/**
     * A basic function that checks if a node is tabbale
     */
    	const baseIsTabbable = node => node.tabIndex >= 0 && !node.hidden && !node.disabled && node.style.display !== 'none' && node.type !== 'hidden' && Boolean(node.offsetWidth || node.offsetHeight || node.getClientRects().length);

    	let { isTabbable = baseIsTabbable } = $$props;
    	let { show = null } = $$props;
    	let { key = 'simple-modal' } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { ariaLabelledBy = null } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { classBg = null } = $$props;
    	let { classWindowWrap = null } = $$props;
    	let { classWindow = null } = $$props;
    	let { classContent = null } = $$props;
    	let { classCloseButton = null } = $$props;
    	let { unstyled = false } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;
    	let { disableFocusTrap = false } = $$props;

    	const defaultState = {
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isTabbable,
    		unstyled
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, '')
    	: '';

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(6, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(7, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(8, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(9, cssContent = toCssString(state.styleContent));
    		$$invalidate(10, cssCloseButton = toCssString(state.styleCloseButton));
    		$$invalidate(11, currentTransitionBg = state.transitionBg);
    		$$invalidate(12, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(2, Component = bind(NewComponent, newProps));
    		$$invalidate(1, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		$$invalidate(13, onOpen = event => {
    			if (callback.onOpen) callback.onOpen(event);

    			/**
     * The open event is fired right before the modal opens
     * @event {void} open
     */
    			dispatch('open');

    			/**
     * The opening event is fired right before the modal opens
     * @event {void} opening
     * @deprecated Listen to the `open` event instead
     */
    			dispatch('opening'); // Deprecated. Do not use!
    		});

    		$$invalidate(14, onClose = event => {
    			if (callback.onClose) callback.onClose(event);

    			/**
     * The close event is fired right before the modal closes
     * @event {void} close
     */
    			dispatch('close');

    			/**
     * The closing event is fired right before the modal closes
     * @event {void} closing
     * @deprecated Listen to the `close` event instead
     */
    			dispatch('closing'); // Deprecated. Do not use!
    		});

    		$$invalidate(15, onOpened = event => {
    			if (callback.onOpened) callback.onOpened(event);

    			/**
     * The opened event is fired after the modal's opening transition
     * @event {void} opened
     */
    			dispatch('opened');
    		});

    		$$invalidate(16, onClosed = event => {
    			if (callback.onClosed) callback.onClosed(event);

    			/**
     * The closed event is fired after the modal's closing transition
     * @event {void} closed
     */
    			dispatch('closed');
    		});
    	};

    	const close = (callback = {}) => {
    		if (!Component) return;
    		$$invalidate(14, onClose = callback.onClose || onClose);
    		$$invalidate(16, onClosed = callback.onClosed || onClosed);
    		$$invalidate(2, Component = null);
    		enableScroll();
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === 'Escape') {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === 'Tab' && !state.disableFocusTrap) {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(state.isTabbable).sort((a, b) => a.tabIndex - b.tabIndex);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = 'fixed';
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = 'hidden';
    		document.body.style.width = '100%';
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || '';
    		document.body.style.top = '';
    		document.body.style.overflow = prevBodyOverflow || '';
    		document.body.style.width = prevBodyWidth || '';
    		window.scrollTo(0, scrollY);
    	};

    	setContext$1(key, { open, close });
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(46, isMounted = true);
    	});

    	const writable_props = [
    		'isTabbable',
    		'show',
    		'key',
    		'ariaLabel',
    		'ariaLabelledBy',
    		'closeButton',
    		'closeOnEsc',
    		'closeOnOuterClick',
    		'styleBg',
    		'styleWindowWrap',
    		'styleWindow',
    		'styleContent',
    		'styleCloseButton',
    		'classBg',
    		'classWindowWrap',
    		'classWindow',
    		'classContent',
    		'classCloseButton',
    		'unstyled',
    		'setContext',
    		'transitionBg',
    		'transitionBgProps',
    		'transitionWindow',
    		'transitionWindowProps',
    		'disableFocusTrap'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('isTabbable' in $$props) $$invalidate(22, isTabbable = $$props.isTabbable);
    		if ('show' in $$props) $$invalidate(23, show = $$props.show);
    		if ('key' in $$props) $$invalidate(24, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(25, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(26, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(27, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(28, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(29, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(30, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(31, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(32, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(33, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(34, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(35, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(36, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(37, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(38, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(39, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(40, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(41, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(42, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(43, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(44, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(45, disableFocusTrap = $$props.disableFocusTrap);
    		if ('$$scope' in $$props) $$invalidate(47, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		bind,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		baseIsTabbable,
    		isTabbable,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		unstyled,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		isMounted
    	});

    	$$self.$inject_state = $$props => {
    		if ('isTabbable' in $$props) $$invalidate(22, isTabbable = $$props.isTabbable);
    		if ('show' in $$props) $$invalidate(23, show = $$props.show);
    		if ('key' in $$props) $$invalidate(24, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(25, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(26, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(27, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(28, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(29, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(30, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(31, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(32, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(33, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(34, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(35, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(36, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(37, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(38, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(39, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(40, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(41, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(42, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(43, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(44, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(45, disableFocusTrap = $$props.disableFocusTrap);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ('modalWindow' in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ('scrollY' in $$props) scrollY = $$props.scrollY;
    		if ('cssBg' in $$props) $$invalidate(6, cssBg = $$props.cssBg);
    		if ('cssWindowWrap' in $$props) $$invalidate(7, cssWindowWrap = $$props.cssWindowWrap);
    		if ('cssWindow' in $$props) $$invalidate(8, cssWindow = $$props.cssWindow);
    		if ('cssContent' in $$props) $$invalidate(9, cssContent = $$props.cssContent);
    		if ('cssCloseButton' in $$props) $$invalidate(10, cssCloseButton = $$props.cssCloseButton);
    		if ('currentTransitionBg' in $$props) $$invalidate(11, currentTransitionBg = $$props.currentTransitionBg);
    		if ('currentTransitionWindow' in $$props) $$invalidate(12, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ('prevBodyPosition' in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ('prevBodyOverflow' in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ('prevBodyWidth' in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ('outerClickTarget' in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ('onOpen' in $$props) $$invalidate(13, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(14, onClose = $$props.onClose);
    		if ('onOpened' in $$props) $$invalidate(15, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(16, onClosed = $$props.onClosed);
    		if ('isMounted' in $$props) $$invalidate(46, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 8388608 | $$self.$$.dirty[1] & /*isMounted*/ 32768) {
    			{
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		unstyled,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		isTabbable,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$p,
    			create_fragment$p,
    			safe_not_equal,
    			{
    				isTabbable: 22,
    				show: 23,
    				key: 24,
    				ariaLabel: 25,
    				ariaLabelledBy: 26,
    				closeButton: 27,
    				closeOnEsc: 28,
    				closeOnOuterClick: 29,
    				styleBg: 30,
    				styleWindowWrap: 31,
    				styleWindow: 32,
    				styleContent: 33,
    				styleCloseButton: 34,
    				classBg: 35,
    				classWindowWrap: 36,
    				classWindow: 37,
    				classContent: 38,
    				classCloseButton: 39,
    				unstyled: 0,
    				setContext: 40,
    				transitionBg: 41,
    				transitionBgProps: 42,
    				transitionWindow: 43,
    				transitionWindowProps: 44,
    				disableFocusTrap: 45
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get isTabbable() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isTabbable(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unstyled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unstyled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableFocusTrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableFocusTrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Tailwindcss.svelte generated by Svelte v3.48.0 */

    function create_fragment$o(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tailwindcss', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tailwindcss> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwindcss extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    class Vertice$1 {
        constructor(id, fuente, sumidero, posicion, nombre, radio, grafo) {
            this.id = id;
            this.nombre = nombre || null;
            this.fuente = fuente;
            this.sumidero = sumidero;
            this.posicion = posicion;
            this.radio = (radio === undefined || radio === null) ? 35 : radio;
            this.grafo = grafo || null;
        }
        mover(posicion) {
            const nuevaPosicion = {
                x: Math.max(this.radio, Math.min(this.grafo.width - (this.radio * 2), posicion.x)),
                y: Math.max(this.radio, Math.min(this.grafo.height - (this.radio), posicion.y)),
            };
            this.posicion = nuevaPosicion;
            this.grafo.recargarGrafo();
        }
        eliminar() {
            this.grafo.eliminarVertice(this);
        }
        toggleFuente() {
            this.fuente = !this.fuente;
            this.grafo.fuentes[this.id] = this.fuente;
        }
        toggleSumidero() {
            this.sumidero = !this.sumidero;
            this.grafo.sumideros[this.id] = this.sumidero;
        }
        asignarGrafo(grafo) {
            this.grafo = grafo;
        }
        reposicionarLimites(width, height) {
            const nuevaPosX = Math.max(this.radio, Math.min(width - (this.radio * 2), this.posicion.x));
            const nuevaPosY = Math.max(this.radio, Math.min(height - (this.radio), this.posicion.y));
            if (nuevaPosX !== this.posicion.x || nuevaPosY !== this.posicion.y) {
                this.mover({ x: nuevaPosX, y: nuevaPosY });
            }
        }
    }

    class Arista$1 {
        constructor(origen, destino, esCamino, fueCamino, peso, flujo, grafo) {
            this.origen = origen;
            this.destino = destino;
            this.esCamino = esCamino;
            this.fueCamino = fueCamino;
            this.peso = peso;
            this.flujo = flujo;
            this.grafo = grafo;
        }
        cambiarPeso(peso) {
            this.peso = peso;
            this.grafo.matrizAdyacencia[this.origen.id][this.destino.id] = peso;
            this.grafo.recargarGrafo();
            if (this.peso === 0) {
                this.grafo.eliminarArista(this);
            }
        }
        asignarGrafo(grafo) {
            this.grafo = grafo;
        }
        eliminar() {
            this.grafo.eliminarArista(this);
        }
    }

    function cancelarConClick(callback) {
        const mousedown = (e) => {
            callback();
            document.removeEventListener("mousedown", mousedown);
        };
        document.addEventListener("mousedown", mousedown);
    }
    class Grafo$2 {
        constructor(matrizAdyacencia, fuentes, sumideros, vertices, aristas, consola, width, height, recargarGrafo) {
            this.matrizAdyacencia = matrizAdyacencia;
            this.fuentes = fuentes;
            this.sumideros = sumideros;
            this.vertices = vertices;
            this.aristas = aristas;
            this.width = width;
            this.height = height;
            this.consola = consola;
            //this.recargarAristas = recargarAristas;
            //this.recargarVertices = recargarVertices;
            this.recargarGrafo = recargarGrafo;
            this.ejecutandoFlujoMaximo = false;
            this.avanzarIteracionFlujoMaximo = false;
            this.recargarRedResidual();
        }
        iniciarCreacionVertice() {
            this.creandoVertice = true;
            this.recargarGrafo();
            this.crearVerticeDinamico();
        }
        crearVerticeDinamico() {
            const centro = {
                x: this.width / 2,
                y: this.height / 2,
            };
            const nuevoVertice = new Vertice$1(this.vertices.length, false, false, centro, "Nuevo Vertice", null, this);
            //lo metemos al grafo para que sea renderizado
            this.vertices.push(nuevoVertice);
            this.recargarGrafo();
            //hacemos que el nuevo grafo siga al mouse
            const mousemove = (e) => {
                nuevoVertice.mover({ x: e.clientX, y: e.clientY });
            };
            window.addEventListener("mousemove", mousemove);
            //cuando se haga click, se crea el vertice
            const mousedown = (e) => {
                //eliminamos el vertice falso
                this.vertices.splice(this.vertices.indexOf(nuevoVertice), 1);
                //creamos el vertice real
                this.crearNuevoVertice(false, false, { x: e.clientX, y: e.clientY }, null, null);
                this.finalizarCreacionVertice();
                //quitamos los listeners
                window.removeEventListener("mousemove", mousemove);
                window.removeEventListener("mouseup", mousedown);
            };
            window.addEventListener("mouseup", mousedown);
        }
        finalizarCreacionVertice() {
            this.creandoVertice = false;
            this.recargarGrafo();
        }
        iniciarEliminacionArista() {
            this.eliminandoArista = true;
            this.recargarGrafo();
            const mousedown = async (e) => {
                //esperamos 100ms para que el evento de click del vertice se ejecute
                await new Promise((resolve) => setTimeout(resolve, 100));
                this.finalizarEliminacionArista();
                document.removeEventListener("mousedown", mousedown);
            };
            document.addEventListener("mousedown", mousedown);
            //cancelarConClick(this.finalizarEliminacionArista.bind(this));
        }
        finalizarEliminacionArista() {
            this.eliminandoArista = false;
            this.recargarGrafo();
        }
        iniciarCreacionArista() {
            this.nuevaAristaVerticeOrigen = null;
            this.creandoArista = true;
            this.recargarGrafo();
            //cancelarConClick(this.finalizarCreacionArista.bind(this));
            const mousedown = (e) => {
                if (!this.nuevaAristaVerticeOrigen) {
                    this.finalizarCreacionArista();
                    document.removeEventListener("mousedown", mousedown);
                }
            };
            document.addEventListener("mousedown", mousedown);
        }
        seleccionarVerticeNuevaArista(vertice) {
            this.nuevaAristaVerticeOrigen = vertice;
            //dibujamos un vertice falso conectado por una arista al vertice seleccionado
            const verticeFalso = new Vertice$1(-1, false, false, { x: vertice.posicion.x, y: vertice.posicion.y }, "", 0, this);
            this.vertices.push(verticeFalso);
            const arista = new Arista$1(vertice, verticeFalso, false, false, -1, 0, this);
            this.aristas[vertice.id][vertice.id] = arista;
            this.recargarGrafo();
            //hacemos que el vertice falso siga al mouse
            const mousemove = (e) => {
                verticeFalso.mover({ x: e.clientX, y: e.clientY });
            };
            window.addEventListener("mousemove", mousemove);
            let firstClick = false;
            const mousedown = () => {
                if (!firstClick) {
                    firstClick = true;
                    return;
                }
                this.vertices.splice(this.vertices.indexOf(verticeFalso), 1);
                this.aristas[vertice.id][vertice.id] = null;
                document.removeEventListener("mousemove", mousemove);
                document.removeEventListener("mousedown", mousedown);
                this.finalizarCreacionArista();
            };
            document.addEventListener("mousedown", mousedown);
        }
        finalizarCreacionArista() {
            this.creandoArista = false;
            this.nuevaAristaVerticeOrigen = null;
            this.recargarGrafo();
        }
        iniciarEliminacionVertice() {
            this.eliminandoVertice = true;
            this.recargarGrafo();
            cancelarConClick(this.finalizarEliminacionVertice.bind(this));
        }
        eliminarVertice(vertice) {
            console.log({ vertice });
            //eliminamos el vertice de los arreglos
            this.vertices.splice(vertice.id, 1);
            this.fuentes.splice(vertice.id, 1);
            this.sumideros.splice(vertice.id, 1);
            //dismunimos el id de los vertices posteriores
            for (let i = vertice.id; i < this.vertices.length; i++) {
                this.vertices[i].id--;
            }
            //eliminamos la columna y la fila de la matriz de adyacencia
            this.matrizAdyacencia.splice(vertice.id, 1);
            for (let i = 0; i < this.matrizAdyacencia.length; i++) {
                this.matrizAdyacencia[i].splice(vertice.id, 1);
            }
            console.log(this.matrizAdyacencia);
            //eliminamos la columna y la fila de la matriz de aristas
            this.aristas.splice(vertice.id, 1);
            for (let i = 0; i < this.aristas.length; i++) {
                this.aristas[i].splice(vertice.id, 1);
            }
            this.recargarGrafo();
        }
        finalizarEliminacionVertice() {
            this.eliminandoVertice = false;
            this.recargarGrafo();
        }
        generarGrafoAlAzar(cantVertices) {
            const grafo = generarGrafoAlAzar(cantVertices, this.width, this.height, this.recargarGrafo, this);
            this.matrizAdyacencia = grafo.matrizAdyacencia;
            this.fuentes = grafo.fuentes;
            this.sumideros = grafo.sumideros;
            this.vertices = grafo.vertices;
            this.aristas = grafo.aristas;
            this.recargarGrafo();
        }
        eliminarArista(arista) {
            this.matrizAdyacencia[arista.origen.id][arista.destino.id] = 0;
            //this.matrizAdyacencia[arista.destino.id][arista.origen.id] = 0;
            this.aristas[arista.origen.id][arista.destino.id] = null;
            //this.aristas[arista.destino.id][arista.origen.id] = null;
            this.recargarGrafo();
        }
        guardarGrafo() {
            //copiamos los valores de la matriz de adyacencia sin la propiedad de grafo
            const matrizAdyacencia = [];
            for (let i = 0; i < this.matrizAdyacencia.length; i++) {
                matrizAdyacencia[i] = [];
                for (let j = 0; j < this.matrizAdyacencia[i].length; j++) {
                    matrizAdyacencia[i][j] = (this.matrizAdyacencia[i][j] !== Infinity ? this.matrizAdyacencia[i][j] : -1); // JSON NO SOPORTA INFINITY
                }
            }
            //copiamos las posiciones de los vertices
            const posicionesVertices = [];
            for (let i = 0; i < this.vertices.length; i++) {
                posicionesVertices.push(this.vertices[i].posicion);
            }
            const grafo = {
                matrizAdyacencia,
                posicionesVertices,
                fuentes: this.fuentes,
                sumideros: this.sumideros
            };
            const blob = new Blob([JSON.stringify(grafo)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = "grafo.json";
            link.href = url;
            link.click();
        }
        inciarFlujoMaximo() {
            this.ejecutandoFlujoMaximo = true;
            this.avanzarIteracionFlujoMaximo = false;
            const fuentes = this.vertices.filter(vertice => vertice.fuente);
            const sumideros = this.vertices.filter(vertice => vertice.sumidero);
            if (fuentes.length === 0) {
                alert("Debe haber al menos una fuente");
                this.finalizarFlujoMaximo();
                return;
            }
            if (sumideros.length === 0) {
                alert("Debe haber al menos un sumidero");
                this.finalizarFlujoMaximo();
                return;
            }
            let fuente = fuentes[0];
            let sumidero = sumideros[0];
            if (fuentes.length > 1 || sumideros.length > 1) {
                if (!confirm("Se deben agregar vertices extra para ejecutar el algoritmo de flujo maximo con multiples fuentes y sumideros. ¿Desea continuar?")) {
                    this.finalizarFlujoMaximo();
                    return;
                }
                if (fuentes.length > 1) {
                    const verticeNuevo = this.crearNuevoVertice(true, false, { x: this.width / 3, y: this.height / 2 });
                    for (let i = 0; i < fuentes.length; i++) {
                        this.crearNuevaArista(verticeNuevo, fuentes[i], Infinity);
                        fuentes[i].toggleFuente();
                    }
                    fuente = verticeNuevo;
                }
                if (sumideros.length > 1) {
                    const verticeNuevo = this.crearNuevoVertice(false, true, { x: this.width * 2 / 3, y: this.height / 2 });
                    for (let i = 0; i < sumideros.length; i++) {
                        this.crearNuevaArista(sumideros[i], verticeNuevo, Infinity);
                        sumideros[i].toggleSumidero();
                    }
                    sumidero = verticeNuevo;
                }
            }
            this.calcularFlujoMaximo(fuente, sumidero);
        }
        continuarFlujoMaximo() {
            this.avanzarIteracionFlujoMaximo = true;
        }
        finalizarFlujoMaximo() {
            this.ejecutandoFlujoMaximo = false;
            this.avanzarIteracionFlujoMaximo = false;
            this.clearCaminos();
            this.recargarGrafo();
            if (this.abortarFlujoMaximo) {
                this.abortarFlujoMaximo.abort();
                this.abortarFlujoMaximo = null;
            }
            this.recargarRedResidual();
        }
        generarGrafo(matrizAdyacencia, posicionesVertices, fuentes, sumideros) {
            const grafo = generarGrafo(matrizAdyacencia, posicionesVertices, fuentes, sumideros, this.width, this.height, this.recargarGrafo, this);
            this.matrizAdyacencia = grafo.matrizAdyacencia;
            this.fuentes = grafo.fuentes;
            this.sumideros = grafo.sumideros;
            this.vertices = grafo.vertices;
            this.aristas = grafo.aristas;
            this.ejecutandoFlujoMaximo = false;
            this.recargarGrafo();
        }
        crearNuevoVertice(fuente, sumidero, posicion, nombre, radio) {
            const nuevoVertice = new Vertice$1(this.vertices.length, fuente, sumidero, posicion, nombre, radio, this);
            this.vertices.push(nuevoVertice);
            this.fuentes.push(fuente);
            this.sumideros.push(sumidero);
            //generamos una nueva fila y columna en la matriz de adyacencia
            this.matrizAdyacencia.push(Array(this.vertices.length).fill(0));
            for (let i = 0; i < this.matrizAdyacencia.length; i++) {
                this.matrizAdyacencia[i].push(0);
            }
            //generamos una nueva fila y columna en la matriz de aristas
            this.aristas.push(Array(this.vertices.length).fill(null));
            for (let i = 0; i < this.aristas.length; i++) {
                this.aristas[i].push(null);
            }
            this.recargarGrafo();
            return nuevoVertice;
        }
        crearNuevaArista(verticeOrigen, verticeDestino, peso) {
            //console.log({verticeOrigen, verticeDestino, peso});
            //Si la matriz ya existe y es bidireccional, entonces no se puede crear una nueva
            if (this.matrizAdyacencia[verticeOrigen.id][verticeDestino.id] !== 0) {
                alert("Ya existe esta arista");
                this.finalizarCreacionArista();
                return;
            }
            //Creamos la arista
            const nuevaArista = new Arista$1(verticeOrigen, verticeDestino, false, false, peso, 0, this);
            this.aristas[verticeOrigen.id][verticeDestino.id] = nuevaArista;
            this.matrizAdyacencia[verticeOrigen.id][verticeDestino.id] = peso;
            this.finalizarCreacionArista();
        }
        DFSRecursivo(verticeActual, destino, visitados, camino) {
            visitados[verticeActual.id] = true;
            if (verticeActual === destino) {
                return [...camino, destino];
            }
            for (let i = 0; i < this.vertices.length; i++) {
                if (this.redResidual[verticeActual.id][i] !== 0 && !visitados[i]) {
                    const caminoRecursivo = this.DFSRecursivo(this.vertices[i], destino, visitados, [...camino, verticeActual]);
                    if (caminoRecursivo) { // si existe un camino
                        return caminoRecursivo;
                    }
                }
            }
            return null;
        }
        buscarCamino(origen, destino) {
            //DFS
            let visitados = new Array(this.vertices.length).fill(false);
            //console.log({redResidual: this.redResidual, visitados});
            let camino = [];
            camino = this.DFSRecursivo(origen, destino, visitados, camino);
            return camino;
        }
        clearCaminos() {
            for (let i = 0; i < this.aristas.length; i++) {
                for (let j = 0; j < this.aristas.length; j++) {
                    if (this.aristas[i][j]) {
                        this.aristas[i][j].esCamino = false;
                        this.aristas[i][j].fueCamino = false;
                        this.aristas[i][j].flujo = 0;
                    }
                }
            }
        }
        dibujarCamino(camino, flujo) {
            //los caminos anteriores se guardan y se dibujan de otra forma
            for (let i = 0; i < this.aristas.length; i++) {
                for (let j = 0; j < this.aristas.length; j++) {
                    if (this.aristas[i][j] && this.aristas[i][j].esCamino) {
                        this.aristas[i][j].esCamino = false;
                        this.aristas[i][j].fueCamino = true;
                    }
                }
            }
            for (let i = 0; i < camino.length - 1; i++) {
                const vertice = camino[i];
                const verticeSiguiente = camino[i + 1];
                //console.log({vertice, verticeSiguiente});
                //console.log({arregloAristas});
                const arista = this.aristas[vertice.id][verticeSiguiente.id];
                if (arista) {
                    console.log({ arista });
                    arista.esCamino = true;
                    arista.fueCamino = false;
                    //arista.flujo = flujo;
                    arista.flujo = arista.flujo + flujo;
                }
            }
            this.recargarGrafo();
        }
        recargarRedResidual() {
            const nuevaRedResidual = [];
            for (let i = 0; i < this.matrizAdyacencia.length; i++) {
                nuevaRedResidual.push([]);
                for (let j = 0; j < this.matrizAdyacencia.length; j++) {
                    nuevaRedResidual[i].push(structuredClone(this.matrizAdyacencia[i][j]));
                }
            }
            this.redResidual = nuevaRedResidual;
        }
        async esperarProximaIteracion() {
            while (!this.avanzarIteracionFlujoMaximo && (this.abortarFlujoMaximo && !this.abortarFlujoMaximo.signal.aborted)) {
                await new Promise(res => setTimeout(res, 100));
            }
            return new Promise((resolve, reject) => {
                if (!this.abortarFlujoMaximo || this.abortarFlujoMaximo.signal.aborted) {
                    const error = new Error("El flujo maximo fue abortado");
                    reject(error);
                }
                this.recargarGrafo();
                console.log("Esperando siguiente iteracion");
                this.avanzarIteracionFlujoMaximo = false;
                this.recargarGrafo();
                resolve();
            });
        }
        async calcularFlujoMaximo(fuente, sumidero) {
            if (!this.consola.abierta) {
                this.consola.abrir();
            }
            try {
                this.abortarFlujoMaximo = new AbortController();
                this.recargarRedResidual(); // <-- Hacemos esto aca para evitar problemas al mostrar la variable en consola
                this.consola.printTextoExplicativo("✨ Iniciamos la variable de flujo maximo en 0");
                this.consola.setUbicacionPseudoCodigo("DEFINIR FLUJO_MAXIMO = 0");
                let flujoMaximo = 0;
                await this.esperarProximaIteracion();
                this.consola.printTextoExplicativo("🕸️ Creamos la red residual como una copia de la matriz de adyacencia");
                this.consola.setUbicacionPseudoCodigo("DEFINIR RED_RESIDUAL = MATRIZ_ADYACENCIA");
                //this.recargarRedResidual();
                await this.esperarProximaIteracion();
                this.consola.printTextoExplicativo("🔍️ Buscamos un camino desde la fuente al sumidero, utilizando la red residual");
                this.consola.setUbicacionPseudoCodigo("CAMINO = ENCONTRAR_CAMINO_AUMENTANTE(RED_RESIDUAL, FUENTE, SUMIDERO)");
                let camino = this.buscarCamino(fuente, sumidero);
                await this.esperarProximaIteracion();
                while (true) {
                    if (!camino) {
                        this.consola.printTextoExplicativo("🚫 No existe otro camino desde la fuente al sumidero, por lo tanto finalizamos el algoritmo");
                        this.consola.setUbicacionPseudoCodigo("FIN_MIENTRAS");
                        await this.esperarProximaIteracion();
                        this.consola.printTextoExplicativo("🎉 El flujo maximo es: " + flujoMaximo);
                        this.consola.setUbicacionPseudoCodigo("RETORNAR FLUJO_MAXIMO");
                        await this.esperarProximaIteracion();
                        this.finalizarFlujoMaximo();
                        return;
                    }
                    this.consola.printTextoExplicativo("🗺️ Existe un camino desde la fuente al sumidero, pasando por los vertices: " + camino.map(vertice => vertice.id).join(", "));
                    this.consola.setUbicacionPseudoCodigo("MIENTRAS EXISTA CAMINO:");
                    this.dibujarCamino(camino, 0);
                    await this.esperarProximaIteracion();
                    this.consola.printTextoExplicativo("📈 Calculamos el flujo que puede pasar por el camino");
                    this.consola.printTextoExplicativo("📈 El flujo que puede pasar por el camino es el minimo entre las aristas que lo componen");
                    this.consola.setUbicacionPseudoCodigo("    FLUJO_MINIMO = MINIMO(CAPACIDADES(CAMINO))");
                    let cuelloBotella = Number.MAX_SAFE_INTEGER;
                    for (let i = 0; i < camino.length - 1; i++) {
                        const vertice = camino[i];
                        const verticeSiguiente = camino[i + 1];
                        const peso = this.redResidual[vertice.id][verticeSiguiente.id];
                        if (peso < cuelloBotella) {
                            cuelloBotella = peso;
                        }
                    }
                    this.consola.printTextoExplicativo("🚰 El flujo minimo del camino es: " + cuelloBotella);
                    await this.esperarProximaIteracion();
                    this.consola.printTextoExplicativo("➕ Sumamos el flujo minimo al flujo maximo");
                    this.consola.setUbicacionPseudoCodigo("    FLUJO_MAXIMO = FLUJO_MAXIMO + FLUJO_MINIMO");
                    flujoMaximo += cuelloBotella;
                    this.dibujarCamino(camino, cuelloBotella);
                    this.consola.printTextoExplicativo("🚰 El flujo maximo actualmente es: " + flujoMaximo);
                    await this.esperarProximaIteracion();
                    this.consola.printTextoExplicativo("🕸️ Actualizamos la red residual");
                    this.consola.printTextoExplicativo("🕸️ Restamos el flujo minimo a las aristas que componen el camino");
                    this.consola.printTextoExplicativo("🤔 ¿Por que restamos el flujo minimo a las aristas que componen el camino?");
                    this.consola.printTextoExplicativo("🤔 Porque de esta forma estamos indicando que el flujo minimo ya pasó por esas aristas");
                    this.consola.setUbicacionPseudoCodigo("    ACTUALIZAR_CAPACIDADES(RED_RESIDUAL ,CAMINO, FLUJO_MINIMO)");
                    for (let i = 0; i < camino.length - 1; i++) {
                        const vertice = camino[i];
                        const verticeSiguiente = camino[i + 1];
                        this.redResidual[vertice.id][verticeSiguiente.id] -= cuelloBotella;
                    }
                    //this.clearCaminos();
                    await this.esperarProximaIteracion();
                    this.consola.printTextoExplicativo("🔍️ Buscamos un nuevo camino desde la fuente al sumidero, utilizando la red residual");
                    this.consola.setUbicacionPseudoCodigo("    CAMINO = ENCONTRAR_CAMINO_AUMENTANTE(RED_RESIDUAL, FUENTE, SUMIDERO)");
                    camino = this.buscarCamino(fuente, sumidero);
                    await this.esperarProximaIteracion();
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        cambiarTamanio(width, height) {
            this.width = width;
            this.height = height;
            for (let i = 0; i < this.vertices.length; i++) {
                this.vertices[i].reposicionarLimites(width, height);
            }
        }
        actualizarComponentes(matrizAdyacencia, fuentes, sumideros, vertices, aristas, width, height, recargarGrafo) {
            if (matrizAdyacencia) {
                this.matrizAdyacencia = matrizAdyacencia;
            }
            if (fuentes) {
                this.fuentes = fuentes;
            }
            if (sumideros) {
                this.sumideros = sumideros;
            }
            if (vertices) {
                this.vertices = vertices;
            }
            if (aristas) {
                this.aristas = aristas;
            }
            if (width) {
                this.width = width;
            }
            if (height) {
                this.height = height;
            }
            if (recargarGrafo) {
                this.recargarGrafo = recargarGrafo;
            }
        }
    }

    class Consola$1 {
        constructor(grafo) {
            this.abierta = false;
            this.categorias = [
                "EXPLICACION",
                "PSEUDOCODIGO",
                "RED_RESIDUAL",
            ];
            this.categoria = this.categorias[0];
            this.pseudoCodigo = [
                "DEFINIR FLUJO_MAXIMO = 0",
                "DEFINIR RED_RESIDUAL = MATRIZ_ADYACENCIA",
                "CAMINO = ENCONTRAR_CAMINO_AUMENTANTE(RED_RESIDUAL, FUENTE, SUMIDERO)",
                "MIENTRAS EXISTA CAMINO:",
                "    FLUJO_MINIMO = MINIMO(CAPACIDADES(CAMINO))",
                "    FLUJO_MAXIMO = FLUJO_MAXIMO + FLUJO_MINIMO",
                "    ACTUALIZAR_CAPACIDADES(RED_RESIDUAL ,CAMINO, FLUJO_MINIMO)",
                "    CAMINO = ENCONTRAR_CAMINO_AUMENTANTE(RED_RESIDUAL, FUENTE, SUMIDERO)",
                "FIN_MIENTRAS",
                "RETORNAR FLUJO_MAXIMO"
            ];
            this.ubicacionPseudoCodigo = -1;
            this.textoExplicativo = [];
            this.grafo = grafo || null;
        }
        abrir() {
            this.abierta = true;
            this.grafo.recargarGrafo();
        }
        cerrar() {
            this.abierta = false;
            this.grafo.recargarGrafo();
        }
        cambiarCategoria(categoria) {
            if (this.categorias.indexOf(categoria) === -1) {
                console.log("Categoría no valida: " + categoria);
                return;
            }
            this.categoria = categoria;
            this.grafo.recargarGrafo();
        }
        setUbicacionPseudoCodigo(pseudocidigo) {
            const posicion = this.pseudoCodigo.indexOf(pseudocidigo);
            if (posicion === -1) {
                console.log("Pseudocódigo no valido: " + pseudocidigo);
                return;
            }
            this.ubicacionPseudoCodigo = posicion;
            this.grafo.recargarGrafo();
        }
        printTextoExplicativo(texto) {
            const maxTextoExplicativo = 1000;
            this.textoExplicativo.push(texto);
            if (this.textoExplicativo.length > maxTextoExplicativo) {
                this.textoExplicativo.shift();
            }
            this.grafo.recargarGrafo();
        }
        asignarGrafo(grafo) {
            this.grafo = grafo;
        }
    }

    const verticeRadio = 35;
    function generarMatrizAlAzar(cantVertices) {
        const matrizAdyacencia = [];
        for (let i = 0; i < cantVertices; i++) {
            const arreglo = [];
            for (let j = 0; j < cantVertices; j++) {
                if (i === j) {
                    arreglo.push(0);
                }
                else {
                    if (Math.random() > 0.5) {
                        arreglo.push(Math.floor(Math.random() * 100));
                    }
                    else {
                        arreglo.push(0);
                    }
                }
            }
            matrizAdyacencia.push(arreglo);
        }
        //console.log({matrizAdyacencia});
        return matrizAdyacencia;
    }
    function generarPosicionesVertices(cantVertices, width, height) {
        const centro = {
            x: width / 2,
            y: height / 2
        };
        if (cantVertices === 1) {
            return [centro];
        }
        const distancia = Math.min(width, height) / 2 - verticeRadio * 2;
        const angulo = 2 * Math.PI / cantVertices;
        const posiciones = [];
        for (let i = 0; i < cantVertices; i++) {
            const x = centro.x + distancia * Math.cos(i * angulo);
            const y = centro.y + distancia * Math.sin(i * angulo);
            posiciones.push({ x, y });
        }
        return posiciones;
    }
    function generarVertices(matrizAdyacencia, fuentes, sumideros, posiciones) {
        const vertices = [];
        for (let i = 0; i < matrizAdyacencia.length; i++) {
            const nuevoVertice = new Vertice$1(i, fuentes[i], sumideros[i], posiciones[i]);
            vertices.push(nuevoVertice);
        }
        return vertices;
    }
    function asignarGrafoAVertices(vertices, grafo) {
        for (const vertice of vertices) {
            vertice.asignarGrafo(grafo);
        }
    }
    function generarAristas(matrizAdyacencia, vertices) {
        const arregloAristas = [];
        matrizAdyacencia.forEach((arreglo) => {
            arregloAristas.push(new Array(arreglo.length).fill(null));
        });
        for (let i = 0; i < matrizAdyacencia.length; i++) {
            //arregloAristas.push([]);
            for (let j = 0; j < matrizAdyacencia.length; j++) {
                if (j === i)
                    continue;
                if (matrizAdyacencia[i][j] === 0)
                    continue;
                const origen = vertices[i];
                const destino = vertices[j];
                const esCamino = false;
                const fueCamino = false;
                const peso = matrizAdyacencia[i][j];
                const flujo = 0;
                const nuevaArista = new Arista$1(origen, destino, esCamino, fueCamino, peso, flujo, null);
                //arregloAristas[i].push(nuevaArista);
                arregloAristas[i][j] = nuevaArista;
                //arregloAristas[j][i] = nuevaArista;
            }
        }
        return arregloAristas;
    }
    function asignarGrafoAAristas(aristas, grafo) {
        for (const arreglo of aristas) {
            for (const arista of arreglo) {
                if (arista) {
                    arista.asignarGrafo(grafo);
                }
            }
        }
    }
    function generarGrafo(matrizAdyacencia, posicionesVertices, fuentes, sumideros, width, height, recargarGrafo, grafo) {
        const vertices = generarVertices(matrizAdyacencia, fuentes, sumideros, posicionesVertices);
        const aristas = generarAristas(matrizAdyacencia, vertices);
        const consola = new Consola$1();
        if (!grafo) {
            grafo = new Grafo$2(matrizAdyacencia, fuentes, sumideros, vertices, aristas, consola, width, height, recargarGrafo);
        }
        else {
            grafo.actualizarComponentes(matrizAdyacencia, fuentes, sumideros, vertices, aristas, width, height, recargarGrafo);
        }
        consola.asignarGrafo(grafo);
        asignarGrafoAVertices(vertices, grafo);
        asignarGrafoAAristas(aristas, grafo);
        console.log({ grafo });
        return grafo;
    }
    function generarGrafoAlAzar(cantVertices, width, height, recargarGrafo, grafo) {
        const matrizAdyacencia = generarMatrizAlAzar(cantVertices);
        //tomamos el primer vertice como fuente y el ultimo como sumidero
        const fuentes = [];
        const sumideros = [];
        for (let i = 0; i < cantVertices; i++) {
            fuentes.push(false);
            sumideros.push(false);
        }
        fuentes[0] = true;
        sumideros[cantVertices - 1] = true;
        const posiciones = generarPosicionesVertices(cantVertices, width, height);
        return generarGrafo(matrizAdyacencia, posiciones, fuentes, sumideros, width, height, recargarGrafo, grafo);
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    var lib = {};

    /*! Copyright Twitter Inc. and other contributors. Licensed under MIT */
    var twemoji$1=function(){var twemoji={base:"https://twemoji.maxcdn.com/v/14.0.2/",ext:".png",size:"72x72",className:"emoji",convert:{fromCodePoint:fromCodePoint,toCodePoint:toCodePoint},onerror:function onerror(){if(this.parentNode){this.parentNode.replaceChild(createText(this.alt,false),this);}},parse:parse,replace:replace,test:test},escaper={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},re=/(?:\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83e\udef1\ud83c\udffb\u200d\ud83e\udef2\ud83c[\udffc-\udfff]|\ud83e\udef1\ud83c\udffc\u200d\ud83e\udef2\ud83c[\udffb\udffd-\udfff]|\ud83e\udef1\ud83c\udffd\u200d\ud83e\udef2\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\udef1\ud83c\udffe\u200d\ud83e\udef2\ud83c[\udffb-\udffd\udfff]|\ud83e\udef1\ud83c\udfff\u200d\ud83e\udef2\ud83c[\udffb-\udffe]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d\udc8f\ud83c[\udffb-\udfff]|\ud83d\udc91\ud83c[\udffb-\udfff]|\ud83e\udd1d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d\udc8f\udc91]|\ud83e\udd1d)|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd4\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83d\ude36\u200d\ud83c\udf2b\ufe0f|\u2764\ufe0f\u200d\ud83d\udd25|\u2764\ufe0f\u200d\ud83e\ude79|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83d\ude2e\u200d\ud83d\udca8|\ud83d\ude35\u200d\ud83d\udcab|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd\udec3-\udec5\udef0-\udef6]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udc8e\udc90\udc92-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udedd-\udedf\udeeb\udeec\udef4-\udefc\udfe0-\udfeb\udff0]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78-\uddb4\uddb7\uddba\uddbc-\uddcc\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7c\ude80-\ude86\ude90-\udeac\udeb0-\udeba\udec0-\udec2\uded0-\uded9\udee0-\udee7]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,UFE0Fg=/\uFE0F/g,U200D=String.fromCharCode(8205),rescaper=/[&<>'"]/g,shouldntBeParsed=/^(?:iframe|noframes|noscript|script|select|style|textarea)$/,fromCharCode=String.fromCharCode;return twemoji;function createText(text,clean){return document.createTextNode(clean?text.replace(UFE0Fg,""):text)}function escapeHTML(s){return s.replace(rescaper,replacer)}function defaultImageSrcGenerator(icon,options){return "".concat(options.base,options.size,"/",icon,options.ext)}function grabAllTextNodes(node,allText){var childNodes=node.childNodes,length=childNodes.length,subnode,nodeType;while(length--){subnode=childNodes[length];nodeType=subnode.nodeType;if(nodeType===3){allText.push(subnode);}else if(nodeType===1&&!("ownerSVGElement"in subnode)&&!shouldntBeParsed.test(subnode.nodeName.toLowerCase())){grabAllTextNodes(subnode,allText);}}return allText}function grabTheRightIcon(rawText){return toCodePoint(rawText.indexOf(U200D)<0?rawText.replace(UFE0Fg,""):rawText)}function parseNode(node,options){var allText=grabAllTextNodes(node,[]),length=allText.length,attrib,attrname,modified,fragment,subnode,text,match,i,index,img,rawText,iconId,src;while(length--){modified=false;fragment=document.createDocumentFragment();subnode=allText[length];text=subnode.nodeValue;i=0;while(match=re.exec(text)){index=match.index;if(index!==i){fragment.appendChild(createText(text.slice(i,index),true));}rawText=match[0];iconId=grabTheRightIcon(rawText);i=index+rawText.length;src=options.callback(iconId,options);if(iconId&&src){img=new Image;img.onerror=options.onerror;img.setAttribute("draggable","false");attrib=options.attributes(rawText,iconId);for(attrname in attrib){if(attrib.hasOwnProperty(attrname)&&attrname.indexOf("on")!==0&&!img.hasAttribute(attrname)){img.setAttribute(attrname,attrib[attrname]);}}img.className=options.className;img.alt=rawText;img.src=src;modified=true;fragment.appendChild(img);}if(!img)fragment.appendChild(createText(rawText,false));img=null;}if(modified){if(i<text.length){fragment.appendChild(createText(text.slice(i),true));}subnode.parentNode.replaceChild(fragment,subnode);}}return node}function parseString(str,options){return replace(str,function(rawText){var ret=rawText,iconId=grabTheRightIcon(rawText),src=options.callback(iconId,options),attrib,attrname;if(iconId&&src){ret="<img ".concat('class="',options.className,'" ','draggable="false" ','alt="',rawText,'"',' src="',src,'"');attrib=options.attributes(rawText,iconId);for(attrname in attrib){if(attrib.hasOwnProperty(attrname)&&attrname.indexOf("on")!==0&&ret.indexOf(" "+attrname+"=")===-1){ret=ret.concat(" ",attrname,'="',escapeHTML(attrib[attrname]),'"');}}ret=ret.concat("/>");}return ret})}function replacer(m){return escaper[m]}function returnNull(){return null}function toSizeSquaredAsset(value){return typeof value==="number"?value+"x"+value:value}function fromCodePoint(codepoint){var code=typeof codepoint==="string"?parseInt(codepoint,16):codepoint;if(code<65536){return fromCharCode(code)}code-=65536;return fromCharCode(55296+(code>>10),56320+(code&1023))}function parse(what,how){if(!how||typeof how==="function"){how={callback:how};}return (typeof what==="string"?parseString:parseNode)(what,{callback:how.callback||defaultImageSrcGenerator,attributes:typeof how.attributes==="function"?how.attributes:returnNull,base:typeof how.base==="string"?how.base:twemoji.base,ext:how.ext||twemoji.ext,size:how.folder||toSizeSquaredAsset(how.size||twemoji.size),className:how.className||twemoji.className,onerror:how.onerror||twemoji.onerror})}function replace(text,callback){return String(text).replace(re,callback)}function test(text){re.lastIndex=0;var result=re.test(text);re.lastIndex=0;return result}function toCodePoint(unicodeSurrogates,sep){var r=[],c=0,p=0,i=0;while(i<unicodeSurrogates.length){c=unicodeSurrogates.charCodeAt(i++);if(p){r.push((65536+(p-55296<<10)+(c-56320)).toString(16));p=0;}else if(55296<=c&&c<=56319){p=c;}else {r.push(c.toString(16));}}return r.join(sep||"-")}}();

    var twemoji_esm = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': twemoji$1
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(twemoji_esm);

    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(lib, "__esModule", { value: true });
    var twemoji_2 = lib.twemoji = void 0;
    var twemoji_1 = __importDefault(require$$0);
    function twemoji(node, options) {
        if (options === void 0) { options = {}; }
        twemoji_1.default.parse(node, options);
    }
    twemoji_2 = lib.twemoji = twemoji;

    /* src/components/Ayuda/Items/App/Interfaz.md generated by Svelte v3.48.0 */

    const file$n = "src/components/Ayuda/Items/App/Interfaz.md";

    function create_fragment$n(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let h20;
    	let t5;
    	let p1;
    	let img0;
    	let img0_src_value;
    	let t6;
    	let p2;
    	let t8;
    	let h21;
    	let t10;
    	let p3;
    	let img1;
    	let img1_src_value;
    	let t11;
    	let p4;
    	let t13;
    	let h22;
    	let t15;
    	let p5;
    	let img2;
    	let img2_src_value;
    	let t16;
    	let p6;
    	let img3;
    	let img3_src_value;
    	let t17;
    	let p7;
    	let t18;
    	let em;
    	let t20;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Interfaz";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "La interfaz de la aplicación web se divide en tres partes principales:";
    			t3 = space();
    			h20 = element("h2");
    			h20.textContent = "Menú superior";
    			t5 = space();
    			p1 = element("p");
    			img0 = element("img");
    			t6 = space();
    			p2 = element("p");
    			p2.textContent = "En el menú superior se encuentran los elementos para ejecutar el algoritmo y realizar modificaciones al grafo.";
    			t8 = space();
    			h21 = element("h2");
    			h21.textContent = "Grafo";
    			t10 = space();
    			p3 = element("p");
    			img1 = element("img");
    			t11 = space();
    			p4 = element("p");
    			p4.textContent = "En la parte central de la interfaz se encuentra el grafo, cada vértice se representa por un círculo y cada arista por una línea con su respectivo peso. Los vértices se pueden arrastrar para modificar la posición del grafo. Además, se pueden agregar y eliminar vértices y aristas.";
    			t13 = space();
    			h22 = element("h2");
    			h22.textContent = "Información del algoritmo";
    			t15 = space();
    			p5 = element("p");
    			img2 = element("img");
    			t16 = space();
    			p6 = element("p");
    			img3 = element("img");
    			t17 = space();
    			p7 = element("p");
    			t18 = text("En la parte inferior de la interfaz se encuentra la información del algoritmo, donde se explica paso a paso la ejecución de este junto con su pseudocódigo y los valores de la red residual ");
    			em = element("em");
    			em.textContent = "Gf";
    			t20 = text(".");
    			add_location(h1, file$n, 0, 0, 0);
    			add_location(p0, file$n, 1, 0, 18);
    			add_location(h20, file$n, 2, 0, 96);
    			if (!src_url_equal(img0.src, img0_src_value = "./img/Ayuda/App/Interfaz/MenuSuperior.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Menú Superior");
    			add_location(img0, file$n, 3, 3, 122);
    			add_location(p1, file$n, 3, 0, 119);
    			add_location(p2, file$n, 4, 0, 200);
    			add_location(h21, file$n, 5, 0, 318);
    			if (!src_url_equal(img1.src, img1_src_value = "./img/Ayuda/App/Interfaz/Grafo.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Grafo");
    			add_location(img1, file$n, 6, 3, 336);
    			add_location(p3, file$n, 6, 0, 333);
    			add_location(p4, file$n, 7, 0, 399);
    			add_location(h22, file$n, 8, 0, 686);
    			if (!src_url_equal(img2.src, img2_src_value = "./img/Ayuda/App/Interfaz/AbrirExplicacion.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Abrir Explicación");
    			add_location(img2, file$n, 9, 3, 724);
    			add_location(p5, file$n, 9, 0, 721);
    			if (!src_url_equal(img3.src, img3_src_value = "./img/Ayuda/App/Interfaz/Explicacion.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Explicación");
    			add_location(img3, file$n, 10, 3, 813);
    			add_location(p6, file$n, 10, 0, 810);
    			add_location(em, file$n, 11, 191, 1079);
    			add_location(p7, file$n, 11, 0, 888);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, img0);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, img1);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, img2);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, img3);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, t18);
    			append_dev(p7, em);
    			append_dev(p7, t20);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(p7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$a = {};

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Interfaz', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Interfaz> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$a });
    	return [];
    }

    class Interfaz extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Interfaz",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/App/MenuSuperior.md generated by Svelte v3.48.0 */

    const file$m = "src/components/Ayuda/Items/App/MenuSuperior.md";

    function create_fragment$m(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let h20;
    	let t6;
    	let p2;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let p3;
    	let t9;
    	let h21;
    	let t11;
    	let p4;
    	let img2;
    	let img2_src_value;
    	let t12;
    	let p5;
    	let t14;
    	let p6;
    	let t16;
    	let h22;
    	let t18;
    	let p7;
    	let img3;
    	let img3_src_value;
    	let t19;
    	let p8;
    	let t21;
    	let h23;
    	let t23;
    	let p9;
    	let img4;
    	let img4_src_value;
    	let t24;
    	let p10;
    	let t26;
    	let h24;
    	let t28;
    	let p11;
    	let img5;
    	let img5_src_value;
    	let t29;
    	let p12;
    	let t31;
    	let h25;
    	let t33;
    	let p13;
    	let img6;
    	let img6_src_value;
    	let t34;
    	let p14;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Menú superior";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "El menú superior se divide en seis secciones principales:";
    			t3 = space();
    			p1 = element("p");
    			img0 = element("img");
    			t4 = space();
    			h20 = element("h2");
    			h20.textContent = "Sección de ayuda";
    			t6 = space();
    			p2 = element("p");
    			img1 = element("img");
    			t7 = space();
    			p3 = element("p");
    			p3.textContent = "En la sección de ayuda, se encuentra solamente un ítem, el cual al ser seleccionado muestra una ventana emergente con la información de la aplicación y recursos relacionados al tema de flujo máximo.";
    			t9 = space();
    			h21 = element("h2");
    			h21.textContent = "Sección de ejecución";
    			t11 = space();
    			p4 = element("p");
    			img2 = element("img");
    			t12 = space();
    			p5 = element("p");
    			p5.textContent = "La sección de ejecución contiene tres ítems, que permiten controlar la ejecución del algoritmo de flujo máximo con el grafo actual.";
    			t14 = space();
    			p6 = element("p");
    			p6.textContent = "El primero inicia la ejecución del flujo máximo, el segundo permite avanzar una iteración del algoritmo y el tercero detiene la ejecución.";
    			t16 = space();
    			h22 = element("h2");
    			h22.textContent = "Sección de generación y guardado";
    			t18 = space();
    			p7 = element("p");
    			img3 = element("img");
    			t19 = space();
    			p8 = element("p");
    			p8.textContent = "En la sección de generación y guardado, se encuentran tres ítems, los cuales permiten generan un grafo aleatorio, guardar el grafo actual en un archivo ó abrir un archivo con un grafo previamente guardado respectivamente.";
    			t21 = space();
    			h23 = element("h2");
    			h23.textContent = "Sección de creación de componentes";
    			t23 = space();
    			p9 = element("p");
    			img4 = element("img");
    			t24 = space();
    			p10 = element("p");
    			p10.textContent = "La sección de creación de componentes incluye dos ítems, los cuales al ser seleccionados permiten agregar un vértice o una arista respectivamente.";
    			t26 = space();
    			h24 = element("h2");
    			h24.textContent = "Sección de eliminación de componentes";
    			t28 = space();
    			p11 = element("p");
    			img5 = element("img");
    			t29 = space();
    			p12 = element("p");
    			p12.textContent = "En la sección de eliminación de componentes se encuentran dos ítems, los cuales permiten eliminar un vertice o una arista respectivamente.";
    			t31 = space();
    			h25 = element("h2");
    			h25.textContent = "Sección de cambio de tema";
    			t33 = space();
    			p13 = element("p");
    			img6 = element("img");
    			t34 = space();
    			p14 = element("p");
    			p14.textContent = "La sección de cambio de tema contiene solo un ítem que permite al usuario alternar entre el tema oscuro y claro de la aplicación.";
    			add_location(h1, file$m, 0, 0, 0);
    			add_location(p0, file$m, 1, 0, 23);
    			if (!src_url_equal(img0.src, img0_src_value = "/img/Ayuda/App/MenuSuperior/MenuSuperior.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Menú superior");
    			add_location(img0, file$m, 2, 3, 91);
    			add_location(p1, file$m, 2, 0, 88);
    			add_location(h20, file$m, 3, 0, 172);
    			if (!src_url_equal(img1.src, img1_src_value = "/img/Ayuda/App/MenuSuperior/SeccionAyuda.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Sección de Ayuda");
    			add_location(img1, file$m, 4, 3, 201);
    			add_location(p2, file$m, 4, 0, 198);
    			add_location(p3, file$m, 5, 0, 285);
    			add_location(h21, file$m, 6, 0, 491);
    			if (!src_url_equal(img2.src, img2_src_value = "/img/Ayuda/App/MenuSuperior/SeccionEjecucion.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Sección de Ejecución");
    			add_location(img2, file$m, 7, 3, 524);
    			add_location(p4, file$m, 7, 0, 521);
    			add_location(p5, file$m, 8, 0, 616);
    			add_location(p6, file$m, 9, 0, 755);
    			add_location(h22, file$m, 10, 0, 901);
    			if (!src_url_equal(img3.src, img3_src_value = "/img/Ayuda/App/MenuSuperior/SeccionGeneracionyGuardado.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Sección de Generación y Guardado");
    			add_location(img3, file$m, 11, 3, 946);
    			add_location(p7, file$m, 11, 0, 943);
    			add_location(p8, file$m, 12, 0, 1060);
    			add_location(h23, file$m, 13, 0, 1289);
    			if (!src_url_equal(img4.src, img4_src_value = "/img/Ayuda/App/MenuSuperior/SeccionCreacionComponentes.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Sección de Creación de Componentes");
    			add_location(img4, file$m, 14, 3, 1336);
    			add_location(p9, file$m, 14, 0, 1333);
    			add_location(p10, file$m, 15, 0, 1452);
    			add_location(h24, file$m, 16, 0, 1606);
    			if (!src_url_equal(img5.src, img5_src_value = "/img/Ayuda/App/MenuSuperior/SeccionEliminacionComponentes.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "Sección de Eliminación de Componentes");
    			add_location(img5, file$m, 17, 3, 1656);
    			add_location(p11, file$m, 17, 0, 1653);
    			add_location(p12, file$m, 18, 0, 1778);
    			add_location(h25, file$m, 19, 0, 1924);
    			if (!src_url_equal(img6.src, img6_src_value = "/img/Ayuda/App/MenuSuperior/SeccionCambioTema.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "Sección de Cambio de Tema");
    			add_location(img6, file$m, 20, 3, 1962);
    			add_location(p13, file$m, 20, 0, 1959);
    			add_location(p14, file$m, 21, 0, 2060);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, img0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, img1);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, img2);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p5, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, p6, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, img3);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p8, anchor);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, h23, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, p9, anchor);
    			append_dev(p9, img4);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, p10, anchor);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, h24, anchor);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, p11, anchor);
    			append_dev(p11, img5);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, p12, anchor);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, h25, anchor);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, p13, anchor);
    			append_dev(p13, img6);
    			insert_dev(target, t34, anchor);
    			insert_dev(target, p14, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(h23);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(h24);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(p11);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(p12);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(h25);
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(p13);
    			if (detaching) detach_dev(t34);
    			if (detaching) detach_dev(p14);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$9 = {};

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuSuperior', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuSuperior> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$9 });
    	return [];
    }

    class MenuSuperior extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuSuperior",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/App/SeccionGrafo.md generated by Svelte v3.48.0 */

    const file$l = "src/components/Ayuda/Items/App/SeccionGrafo.md";

    function create_fragment$l(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let p1;
    	let t4;
    	let h20;
    	let t6;
    	let p2;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let p3;
    	let t9;
    	let ul;
    	let li0;
    	let strong0;
    	let t11;
    	let t12;
    	let li1;
    	let strong1;
    	let t14;
    	let t15;
    	let li2;
    	let strong2;
    	let t17;
    	let t18;
    	let p4;
    	let t20;
    	let p5;
    	let img2;
    	let img2_src_value;
    	let t21;
    	let h21;
    	let t23;
    	let p6;
    	let img3;
    	let img3_src_value;
    	let t24;
    	let p7;
    	let t26;
    	let p8;
    	let t28;
    	let p9;
    	let img4;
    	let img4_src_value;
    	let t29;
    	let p10;
    	let t31;
    	let p11;
    	let img5;
    	let img5_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Grafo";
    			t1 = space();
    			p0 = element("p");
    			img0 = element("img");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "En la parte central de la interfaz se encuentra el grafo, que contiene los vértices y las aristas.";
    			t4 = space();
    			h20 = element("h2");
    			h20.textContent = "Vértices";
    			t6 = space();
    			p2 = element("p");
    			img1 = element("img");
    			t7 = space();
    			p3 = element("p");
    			p3.textContent = "Cada vértice se representa por un círculo, el cual puede ser arrastrado para modificar la posición del grafo.\nEl color denota el tipo de vértice, siendo:";
    			t9 = space();
    			ul = element("ul");
    			li0 = element("li");
    			strong0 = element("strong");
    			strong0.textContent = "Verde";
    			t11 = text(": Fuente");
    			t12 = space();
    			li1 = element("li");
    			strong1 = element("strong");
    			strong1.textContent = "Rojo";
    			t14 = text(": Sumidero");
    			t15 = space();
    			li2 = element("li");
    			strong2 = element("strong");
    			strong2.textContent = "Morado";
    			t17 = text(": Vértice intermedio");
    			t18 = space();
    			p4 = element("p");
    			p4.textContent = "Es posible cambiar el tipo de vértice haciendo click sobre el botón correspondiente.";
    			t20 = space();
    			p5 = element("p");
    			img2 = element("img");
    			t21 = space();
    			h21 = element("h2");
    			h21.textContent = "Aristas";
    			t23 = space();
    			p6 = element("p");
    			img3 = element("img");
    			t24 = space();
    			p7 = element("p");
    			p7.textContent = "Cada arista se representa por una línea con su respectivo peso, indicado en el centro de la misma.";
    			t26 = space();
    			p8 = element("p");
    			p8.textContent = "Algunas aristas son bidireccionales, lo que significa que el flujo puede pasar en ambas direcciones. Para indicar esto, se dibuja una flecha en cada extremo de la arista, con colores distintos y se señala el flujo máximo que puede pasar por cada dirección.";
    			t28 = space();
    			p9 = element("p");
    			img4 = element("img");
    			t29 = space();
    			p10 = element("p");
    			p10.textContent = "Es posible modificar el peso de una arista seleccionando la misma y escribiendo el nuevo valor en el cuadro de texto.";
    			t31 = space();
    			p11 = element("p");
    			img5 = element("img");
    			add_location(h1, file$l, 0, 0, 0);
    			if (!src_url_equal(img0.src, img0_src_value = "/img/Ayuda/App/Grafo/Grafo.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Grafo");
    			add_location(img0, file$l, 1, 3, 18);
    			add_location(p0, file$l, 1, 0, 15);
    			add_location(p1, file$l, 2, 0, 77);
    			add_location(h20, file$l, 3, 0, 183);
    			if (!src_url_equal(img1.src, img1_src_value = "/img/Ayuda/App/Grafo/Vertices.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Vértices");
    			add_location(img1, file$l, 4, 3, 204);
    			add_location(p2, file$l, 4, 0, 201);
    			add_location(p3, file$l, 5, 0, 269);
    			add_location(strong0, file$l, 8, 4, 439);
    			add_location(li0, file$l, 8, 0, 435);
    			add_location(strong1, file$l, 9, 4, 479);
    			add_location(li1, file$l, 9, 0, 475);
    			add_location(strong2, file$l, 10, 4, 520);
    			add_location(li2, file$l, 10, 0, 516);
    			add_location(ul, file$l, 7, 0, 430);
    			add_location(p4, file$l, 12, 0, 575);
    			if (!src_url_equal(img2.src, img2_src_value = "/img/Ayuda/App/Grafo/ModificarVertices.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Cambiar tipo de vértice");
    			add_location(img2, file$l, 13, 3, 670);
    			add_location(p5, file$l, 13, 0, 667);
    			add_location(h21, file$l, 14, 0, 759);
    			if (!src_url_equal(img3.src, img3_src_value = "/img/Ayuda/App/Grafo/Aristas.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Aristas");
    			add_location(img3, file$l, 15, 3, 779);
    			add_location(p6, file$l, 15, 0, 776);
    			add_location(p7, file$l, 16, 0, 842);
    			add_location(p8, file$l, 17, 0, 948);
    			if (!src_url_equal(img4.src, img4_src_value = "/img/Ayuda/App/Grafo/AristasBidireccionales.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Aristas bidireccionales");
    			add_location(img4, file$l, 18, 3, 1215);
    			add_location(p9, file$l, 18, 0, 1212);
    			add_location(p10, file$l, 19, 0, 1309);
    			if (!src_url_equal(img5.src, img5_src_value = "/img/Ayuda/App/Grafo/CambiarPeso.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "Modificar peso de arista");
    			add_location(img5, file$l, 20, 3, 1437);
    			add_location(p11, file$l, 20, 0, 1434);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, img0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, img1);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, strong0);
    			append_dev(li0, t11);
    			append_dev(ul, t12);
    			append_dev(ul, li1);
    			append_dev(li1, strong1);
    			append_dev(li1, t14);
    			append_dev(ul, t15);
    			append_dev(ul, li2);
    			append_dev(li2, strong2);
    			append_dev(li2, t17);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, img2);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, img3);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, p7, anchor);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, p8, anchor);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, p9, anchor);
    			append_dev(p9, img4);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, p10, anchor);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, p11, anchor);
    			append_dev(p11, img5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(ul);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(p11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$8 = {};

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SeccionGrafo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SeccionGrafo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$8 });
    	return [];
    }

    class SeccionGrafo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SeccionGrafo",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/App/SeccionInferior.md generated by Svelte v3.48.0 */

    const file$k = "src/components/Ayuda/Items/App/SeccionInferior.md";

    function create_fragment$k(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t2;
    	let em0;
    	let t4;
    	let t5;
    	let h20;
    	let t7;
    	let p1;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let p2;
    	let t10;
    	let h21;
    	let t12;
    	let p3;
    	let img1;
    	let img1_src_value;
    	let t13;
    	let p4;
    	let t15;
    	let h22;
    	let t17;
    	let p5;
    	let img2;
    	let img2_src_value;
    	let t18;
    	let p6;
    	let t19;
    	let em1;
    	let t21;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Sección Inferior";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("En la parte inferior de la interfaz se encuentra la información del algoritmo, donde se explica paso a paso la ejecución de este junto con su pseudocódigo y los valores de la red residual ");
    			em0 = element("em");
    			em0.textContent = "Gf";
    			t4 = text(".");
    			t5 = space();
    			h20 = element("h2");
    			h20.textContent = "Explicación";
    			t7 = space();
    			p1 = element("p");
    			img0 = element("img");
    			t8 = space();
    			p2 = element("p");
    			p2.textContent = "Se incluye la explicación paso a paso de cada parte del algoritmo.";
    			t10 = space();
    			h21 = element("h2");
    			h21.textContent = "Pseudocódigo";
    			t12 = space();
    			p3 = element("p");
    			img1 = element("img");
    			t13 = space();
    			p4 = element("p");
    			p4.textContent = "Se incluye el pseudocódigo del algoritmo, en el cual se resalta la línea que se está ejecutando en cada momento.";
    			t15 = space();
    			h22 = element("h2");
    			h22.textContent = "Red residual";
    			t17 = space();
    			p5 = element("p");
    			img2 = element("img");
    			t18 = space();
    			p6 = element("p");
    			t19 = text("Se incluye la red residual ");
    			em1 = element("em");
    			em1.textContent = "Gf";
    			t21 = text(" en formato de matriz de adyacencia en cada momento de la ejecución del algoritmo.");
    			add_location(h1, file$k, 0, 0, 0);
    			add_location(em0, file$k, 1, 191, 217);
    			add_location(p0, file$k, 1, 0, 26);
    			add_location(h20, file$k, 2, 0, 234);
    			if (!src_url_equal(img0.src, img0_src_value = "/img/Ayuda/App/SeccionInferior/Explicacion.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Explicación");
    			add_location(img0, file$k, 3, 3, 258);
    			add_location(p1, file$k, 3, 0, 255);
    			add_location(p2, file$k, 4, 0, 339);
    			add_location(h21, file$k, 5, 0, 413);
    			if (!src_url_equal(img1.src, img1_src_value = "/img/Ayuda/App/SeccionInferior/Pseudocodigo.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Pseudocódigo");
    			add_location(img1, file$k, 6, 3, 438);
    			add_location(p3, file$k, 6, 0, 435);
    			add_location(p4, file$k, 7, 0, 521);
    			add_location(h22, file$k, 8, 0, 641);
    			if (!src_url_equal(img2.src, img2_src_value = "/img/Ayuda/App/SeccionInferior/RedResidual.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Red residual");
    			add_location(img2, file$k, 9, 3, 666);
    			add_location(p5, file$k, 9, 0, 663);
    			add_location(em1, file$k, 10, 30, 778);
    			add_location(p6, file$k, 10, 0, 748);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, em0);
    			append_dev(p0, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, img0);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, img1);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, img2);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, t19);
    			append_dev(p6, em1);
    			append_dev(p6, t21);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(p6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$7 = {};

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SeccionInferior', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SeccionInferior> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$7 });
    	return [];
    }

    class SeccionInferior extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SeccionInferior",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/Grafo/Grafo.md generated by Svelte v3.48.0 */

    const file$j = "src/components/Ayuda/Items/Grafo/Grafo.md";

    function create_fragment$j(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t2;
    	let strong0;
    	let t4;
    	let strong1;
    	let t6;
    	let t7;
    	let p1;
    	let t9;
    	let p2;
    	let img;
    	let img_src_value;
    	let t10;
    	let h5;
    	let t11;
    	let a;
    	let t13;
    	let p3;
    	let t15;
    	let p4;
    	let t17;
    	let p5;
    	let strong2;
    	let t19;
    	let p6;
    	let t20;
    	let strong3;
    	let t22;
    	let strong4;
    	let t24;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Grafo";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Un grafo es una estructura de datos que consiste en un conjunto de ");
    			strong0 = element("strong");
    			strong0.textContent = "vértices";
    			t4 = text(" y ");
    			strong1 = element("strong");
    			strong1.textContent = "aristas";
    			t6 = text(".");
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Las aristas son las conexiones entre los vértices. Los grafos pueden ser dirigidos o no dirigidos. En un grafo dirigido, las aristas tienen una dirección, mientras que en un grafo no dirigido, las aristas no tienen una dirección.";
    			t9 = space();
    			p2 = element("p");
    			img = element("img");
    			t10 = space();
    			h5 = element("h5");
    			t11 = text("Fuente: ");
    			a = element("a");
    			a.textContent = "Wikimedia";
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "En la imagen anterior, el grafo tiene 6 vértices y 7 aristas.";
    			t15 = space();
    			p4 = element("p");
    			p4.textContent = "Es posible representar matemáticamente un grafo con la ecuación:";
    			t17 = space();
    			p5 = element("p");
    			strong2 = element("strong");
    			strong2.textContent = "G = (V, E)";
    			t19 = space();
    			p6 = element("p");
    			t20 = text("Donde ");
    			strong3 = element("strong");
    			strong3.textContent = "V";
    			t22 = text(" es el conjunto de vértices y ");
    			strong4 = element("strong");
    			strong4.textContent = "E";
    			t24 = text(" es el conjunto de aristas.");
    			add_location(h1, file$j, 0, 0, 0);
    			add_location(strong0, file$j, 1, 70, 85);
    			add_location(strong1, file$j, 1, 98, 113);
    			add_location(p0, file$j, 1, 0, 15);
    			add_location(p1, file$j, 2, 0, 144);
    			if (!src_url_equal(img.src, img_src_value = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/6n-graf.svg/400px-6n-graf.svg.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Grafo con 6 vértices y 7 aristas");
    			add_location(img, file$j, 3, 3, 384);
    			add_location(p2, file$j, 3, 0, 381);
    			attr_dev(a, "href", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/6n-graf.svg/1920px-6n-graf.svg.png");
    			add_location(a, file$j, 4, 12, 545);
    			add_location(h5, file$j, 4, 0, 533);
    			add_location(p3, file$j, 5, 0, 667);
    			add_location(p4, file$j, 6, 0, 736);
    			add_location(strong2, file$j, 7, 3, 811);
    			add_location(p5, file$j, 7, 0, 808);
    			add_location(strong3, file$j, 8, 9, 852);
    			add_location(strong4, file$j, 8, 57, 900);
    			add_location(p6, file$j, 8, 0, 843);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, strong0);
    			append_dev(p0, t4);
    			append_dev(p0, strong1);
    			append_dev(p0, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, img);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t11);
    			append_dev(h5, a);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, strong2);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, t20);
    			append_dev(p6, strong3);
    			append_dev(p6, t22);
    			append_dev(p6, strong4);
    			append_dev(p6, t24);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$6 = {};

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grafo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grafo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$6 });
    	return [];
    }

    class Grafo$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grafo",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/Grafo/MatrizAdyacencia.md generated by Svelte v3.48.0 */

    const file$i = "src/components/Ayuda/Items/Grafo/MatrizAdyacencia.md";

    function create_fragment$i(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let h50;
    	let t5;
    	let a0;
    	let t7;
    	let p1;
    	let t9;
    	let img1;
    	let img1_src_value;
    	let t10;
    	let h51;
    	let t11;
    	let a1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Matriz de Adyacencia";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Una matriz de adyacencia es una matriz cuadrada que representa un grafo. Cada entrada de la matriz representa una arista entre dos vértices. Si la entrada es 1, significa que existe una arista entre los vértices. Si la entrada es 0, significa que no existe una arista entre los vértices.";
    			t3 = space();
    			img0 = element("img");
    			t4 = space();
    			h50 = element("h5");
    			t5 = text("Fuente: ");
    			a0 = element("a");
    			a0.textContent = "Programiz";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Para el grafo de la imagen anterior, la matriz de adyacencia es:";
    			t9 = space();
    			img1 = element("img");
    			t10 = space();
    			h51 = element("h5");
    			t11 = text("Fuente: ");
    			a1 = element("a");
    			a1.textContent = "Programiz";
    			add_location(h1, file$i, 0, 0, 0);
    			add_location(p0, file$i, 1, 0, 30);
    			if (!src_url_equal(img0.src, img0_src_value = "https://www.programiz.com/sites/tutorial2program/files/adjacency-matrix-graph.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "width", "300");
    			attr_dev(img0, "height", "300");
    			attr_dev(img0, "alt", "Grafo con 4 vértices y 4 aristas");
    			add_location(img0, file$i, 2, 0, 325);
    			attr_dev(a0, "href", "https://www.programiz.com/dsa/graph-adjacency-matrix");
    			add_location(a0, file$i, 6, 12, 498);
    			add_location(h50, file$i, 6, 0, 486);
    			add_location(p1, file$i, 7, 0, 580);
    			if (!src_url_equal(img1.src, img1_src_value = "https://www.programiz.com/sites/tutorial2program/files/adjacency-matrix-representation_1.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "width", "300");
    			attr_dev(img1, "height", "300");
    			attr_dev(img1, "alt", "Matriz de adyacencia del grafo de la imagen anterior");
    			add_location(img1, file$i, 8, 0, 652);
    			attr_dev(a1, "href", "https://www.programiz.com/dsa/graph-adjacency-matrix");
    			add_location(a1, file$i, 12, 12, 856);
    			add_location(h51, file$i, 12, 0, 844);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, img0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, h50, anchor);
    			append_dev(h50, t5);
    			append_dev(h50, a0);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, img1, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, h51, anchor);
    			append_dev(h51, t11);
    			append_dev(h51, a1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(img0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h50);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(img1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(h51);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$5 = {};

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MatrizAdyacencia', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MatrizAdyacencia> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$5 });
    	return [];
    }

    class MatrizAdyacencia extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MatrizAdyacencia",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/Grafo/GrafoDirigido.md generated by Svelte v3.48.0 */

    const file$h = "src/components/Ayuda/Items/Grafo/GrafoDirigido.md";

    function create_fragment$h(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t2;
    	let strong0;
    	let t4;
    	let strong1;
    	let t6;
    	let strong2;
    	let t8;
    	let strong3;
    	let t10;
    	let t11;
    	let p1;
    	let t13;
    	let img0;
    	let img0_src_value;
    	let t14;
    	let h5;
    	let t15;
    	let a;
    	let t17;
    	let p2;
    	let t19;
    	let p3;
    	let t20;
    	let strong4;
    	let t22;
    	let strong5;
    	let t24;
    	let strong6;
    	let t26;
    	let t27;
    	let p4;
    	let t29;
    	let p5;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Grafo Dirigido";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Un grafo dirigido corresponde a un grafo en el que las aristas tienen una dirección. El conjunto de aristas ");
    			strong0 = element("strong");
    			strong0.textContent = "E";
    			t4 = text(" contempla arcos ");
    			strong1 = element("strong");
    			strong1.textContent = "e = (x,y)";
    			t6 = text(" tales que ");
    			strong2 = element("strong");
    			strong2.textContent = "x";
    			t8 = text(" es un vértice emisor o de partida mientras que ");
    			strong3 = element("strong");
    			strong3.textContent = "y";
    			t10 = text(" es un vértice receptor o de llegada.");
    			t11 = space();
    			p1 = element("p");
    			p1.textContent = "Generalmente se representa un grafo dirigido con una flecha que indica la dirección de la arista.";
    			t13 = space();
    			img0 = element("img");
    			t14 = space();
    			h5 = element("h5");
    			t15 = text("Fuente: ");
    			a = element("a");
    			a.textContent = "Techie Delight";
    			t17 = space();
    			p2 = element("p");
    			p2.textContent = "En la imagen anterior, se presenta un grafo dirigido, en el que cada arista tiene una dirección representada por una flecha.";
    			t19 = space();
    			p3 = element("p");
    			t20 = text("Cabe destacar que la ");
    			strong4 = element("strong");
    			strong4.textContent = "matriz de adyacencia";
    			t22 = text(" para un grafo dirigido no es simétrica y el valor de cada entrada es 1 si existe una arista desde el vértice ");
    			strong5 = element("strong");
    			strong5.textContent = "i";
    			t24 = text(" al vértice ");
    			strong6 = element("strong");
    			strong6.textContent = "j";
    			t26 = text(" y 0 en caso contrario.");
    			t27 = space();
    			p4 = element("p");
    			p4.textContent = "Para el grafo dirigido de la imagen anterior, la matriz de adyacencia es:";
    			t29 = space();
    			p5 = element("p");
    			img1 = element("img");
    			add_location(h1, file$h, 0, 0, 0);
    			add_location(strong0, file$h, 1, 111, 135);
    			add_location(strong1, file$h, 1, 146, 170);
    			add_location(strong2, file$h, 1, 183, 207);
    			add_location(strong3, file$h, 1, 249, 273);
    			add_location(p0, file$h, 1, 0, 24);
    			add_location(p1, file$h, 2, 0, 333);
    			if (!src_url_equal(img0.src, img0_src_value = "https://www.techiedelight.com/wp-content/uploads/Eulerian-path-for-directed-graphs.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "width", "300");
    			attr_dev(img0, "height", "300");
    			attr_dev(img0, "alt", "Grafo dirigido");
    			add_location(img0, file$h, 3, 0, 438);
    			attr_dev(a, "href", "https://www.techiedelight.com/eulerian-path-directed-graph/");
    			add_location(a, file$h, 4, 12, 597);
    			add_location(h5, file$h, 4, 0, 585);
    			add_location(p2, file$h, 5, 0, 691);
    			add_location(strong4, file$h, 6, 24, 847);
    			add_location(strong5, file$h, 6, 171, 994);
    			add_location(strong6, file$h, 6, 201, 1024);
    			add_location(p3, file$h, 6, 0, 823);
    			add_location(p4, file$h, 7, 0, 1070);
    			if (!src_url_equal(img1.src, img1_src_value = "/img/Ayuda/Grafo/GrafoDirigido/MatrizAdyacencia.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Matriz de adyacencia");
    			add_location(img1, file$h, 8, 3, 1154);
    			add_location(p5, file$h, 8, 0, 1151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, strong0);
    			append_dev(p0, t4);
    			append_dev(p0, strong1);
    			append_dev(p0, t6);
    			append_dev(p0, strong2);
    			append_dev(p0, t8);
    			append_dev(p0, strong3);
    			append_dev(p0, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, img0, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t15);
    			append_dev(h5, a);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t20);
    			append_dev(p3, strong4);
    			append_dev(p3, t22);
    			append_dev(p3, strong5);
    			append_dev(p3, t24);
    			append_dev(p3, strong6);
    			append_dev(p3, t26);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, img1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(img0);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(p5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$4 = {};

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GrafoDirigido', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GrafoDirigido> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$4 });
    	return [];
    }

    class GrafoDirigido extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GrafoDirigido",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/FlujoMaximo/RedDeFlujo.md generated by Svelte v3.48.0 */

    const file$g = "src/components/Ayuda/Items/FlujoMaximo/RedDeFlujo.md";

    function create_fragment$g(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t2;
    	let strong0;
    	let t4;
    	let strong1;
    	let t6;
    	let t7;
    	let p1;
    	let img;
    	let img_src_value;
    	let t8;
    	let p2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Red de flujo";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Una red de flujo consiste en un grafo dirigido, en el cual cada arista posee una capacidad y un flujo. Contiene dos o más vértices llamados fuente y sumidero, los cuales se representan como ");
    			strong0 = element("strong");
    			strong0.textContent = "s";
    			t4 = text(" y ");
    			strong1 = element("strong");
    			strong1.textContent = "t";
    			t6 = text(" respectivamente, el flujo de la red va desde el vértice fuente hasta el vértice sumidero.");
    			t7 = space();
    			p1 = element("p");
    			img = element("img");
    			t8 = space();
    			p2 = element("p");
    			p2.textContent = "En la figura anterior se presenta una red de flujo, donde el vértice 1 corresponde a la fuente y el vértice 5 al sumidero.";
    			add_location(h1, file$g, 0, 0, 0);
    			add_location(strong0, file$g, 1, 193, 215);
    			add_location(strong1, file$g, 1, 214, 236);
    			add_location(p0, file$g, 1, 0, 22);
    			if (!src_url_equal(img.src, img_src_value = "/img/Ayuda/FlujoMaximo/RedDeFlujo/RedDeFlujo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Red de flujo");
    			add_location(img, file$g, 2, 3, 353);
    			add_location(p1, file$g, 2, 0, 350);
    			add_location(p2, file$g, 3, 0, 437);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, strong0);
    			append_dev(p0, t4);
    			append_dev(p0, strong1);
    			append_dev(p0, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, img);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$3 = {};

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RedDeFlujo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RedDeFlujo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$3 });
    	return [];
    }

    class RedDeFlujo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RedDeFlujo",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/FlujoMaximo/ProblemaFlujoMaximo.md generated by Svelte v3.48.0 */

    const file$f = "src/components/Ayuda/Items/FlujoMaximo/ProblemaFlujoMaximo.md";

    function create_fragment$f(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let img;
    	let img_src_value;
    	let t4;
    	let p2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Problema de flujo máximo";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "El problema del flujo máximo consiste en encontrar el flujo máximo que puede pasar por una red de flujo, desde la fuente al sumidero o destino.";
    			t3 = space();
    			p1 = element("p");
    			img = element("img");
    			t4 = space();
    			p2 = element("p");
    			p2.textContent = "En la figura anterior se presenta una red de flujo, donde el vértice 1 corresponde a la fuente y el vértice 5 al sumidero. Y el flujo máximo que puede pasar por la red es de 53.";
    			add_location(h1, file$f, 0, 0, 0);
    			add_location(p0, file$f, 1, 0, 34);
    			if (!src_url_equal(img.src, img_src_value = "/img/Ayuda/FlujoMaximo/FlujoMaximo/FlujoMaximo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Problema de flujo máximo");
    			add_location(img, file$f, 2, 3, 188);
    			add_location(p1, file$f, 2, 0, 185);
    			add_location(p2, file$f, 3, 0, 286);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, img);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, p2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(p2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$2 = {};

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProblemaFlujoMaximo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProblemaFlujoMaximo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$2 });
    	return [];
    }

    class ProblemaFlujoMaximo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProblemaFlujoMaximo",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/FlujoMaximo/TeoremaFMCM.md generated by Svelte v3.48.0 */

    const file$e = "src/components/Ayuda/Items/FlujoMaximo/TeoremaFMCM.md";

    function create_fragment$e(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t4;
    	let strong0;
    	let t6;
    	let strong1;
    	let t8;
    	let strong2;
    	let t10;
    	let t11;
    	let h20;
    	let t13;
    	let p2;
    	let t14;
    	let em0;
    	let t16;
    	let em1;
    	let t18;
    	let em2;
    	let t20;
    	let em3;
    	let t22;
    	let em4;
    	let t24;
    	let em5;
    	let t26;
    	let em6;
    	let t28;
    	let em7;
    	let t30;
    	let t31;
    	let h21;
    	let t33;
    	let p3;
    	let t34;
    	let em8;
    	let t36;
    	let em9;
    	let t38;
    	let em10;
    	let t40;
    	let em11;
    	let t42;
    	let em12;
    	let t44;
    	let em13;
    	let t46;
    	let em14;
    	let t48;
    	let em15;
    	let t50;
    	let t51;
    	let h22;
    	let t53;
    	let p4;
    	let t54;
    	let em16;
    	let t56;
    	let em17;
    	let t58;
    	let em18;
    	let t60;
    	let em19;
    	let t62;
    	let em20;
    	let t64;
    	let em21;
    	let t66;
    	let em22;
    	let t68;
    	let em23;
    	let t70;
    	let em24;
    	let t72;
    	let em25;
    	let t74;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Teorema de flujo máximo y corte mínimo";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Este teorema fue propuesto inicialmente en 1956 por L. R. Ford y D. R. Fulkerson, el cual establece que el flujo máximo de una red de flujo es igual a la suma de las capacidades de las aristas, tales que si estas son eliminadas de la red, la fuente y el sumidero dejan de estar conectados.";
    			t3 = space();
    			p1 = element("p");
    			t4 = text("Para este algoritmo se utilizan los conceptos de ");
    			strong0 = element("strong");
    			strong0.textContent = "redes residuales";
    			t6 = text(", ");
    			strong1 = element("strong");
    			strong1.textContent = "trayectorias de aumento";
    			t8 = text(", y los ");
    			strong2 = element("strong");
    			strong2.textContent = "cortes";
    			t10 = text(".");
    			t11 = space();
    			h20 = element("h2");
    			h20.textContent = "Redes residuales";
    			t13 = space();
    			p2 = element("p");
    			t14 = text("Dada una red ");
    			em0 = element("em");
    			em0.textContent = "G";
    			t16 = text(" y un flujo ");
    			em1 = element("em");
    			em1.textContent = "f";
    			t18 = text(", se puede construir una red residual ");
    			em2 = element("em");
    			em2.textContent = "Gf";
    			t20 = text(" que contiene las aristas con la capacidad restante de ");
    			em3 = element("em");
    			em3.textContent = "G";
    			t22 = text(". Cada arista residual representada como ");
    			em4 = element("em");
    			em4.textContent = "cf";
    			t24 = text(" se construye restando el flujo ");
    			em5 = element("em");
    			em5.textContent = "f";
    			t26 = text(" a la capacidad de cada arista original, es decir, ");
    			em6 = element("em");
    			em6.textContent = "cf(u,v) = c(u,v) - f(u,v)";
    			t28 = text(". Solamente se consideran las aristas que puedan soportar mas flujo, es decir, aquellas que posean una capacidad residual ");
    			em7 = element("em");
    			em7.textContent = "cf(u,v) > 0";
    			t30 = text(".");
    			t31 = space();
    			h21 = element("h2");
    			h21.textContent = "Trayectorias de aumento";
    			t33 = space();
    			p3 = element("p");
    			t34 = text("Dada una red de flujo ");
    			em8 = element("em");
    			em8.textContent = "G = (V,E)";
    			t36 = text(" y un flujo ");
    			em9 = element("em");
    			em9.textContent = "f";
    			t38 = text(", una trayectoria o camino de aumento ");
    			em10 = element("em");
    			em10.textContent = "p";
    			t40 = text(" es un camino simple desde la fuente ");
    			em11 = element("em");
    			em11.textContent = "s";
    			t42 = text(" hasta el sumidero ");
    			em12 = element("em");
    			em12.textContent = "t";
    			t44 = text(". Es posible aumentar el flujo en una arista ");
    			em13 = element("em");
    			em13.textContent = "(u,v)";
    			t46 = text(" de una trayectoria de aumento ");
    			em14 = element("em");
    			em14.textContent = "p";
    			t48 = text(" por una cantidad de ");
    			em15 = element("em");
    			em15.textContent = "cf(u,v)";
    			t50 = text(".");
    			t51 = space();
    			h22 = element("h2");
    			h22.textContent = "Cortes";
    			t53 = space();
    			p4 = element("p");
    			t54 = text("Un corte ");
    			em16 = element("em");
    			em16.textContent = "s-t";
    			t56 = space();
    			em17 = element("em");
    			em17.textContent = "C = (S,T)";
    			t58 = text(" es una partición de los vértices ");
    			em18 = element("em");
    			em18.textContent = "V";
    			t60 = text(" tal que ");
    			em19 = element("em");
    			em19.textContent = "s ∈ S";
    			t62 = text(" y ");
    			em20 = element("em");
    			em20.textContent = "t ∈ T";
    			t64 = text(", donde ");
    			em21 = element("em");
    			em21.textContent = "s";
    			t66 = text(" y ");
    			em22 = element("em");
    			em22.textContent = "t";
    			t68 = text(" corresponden a los vértices fuente y destino respectivamente, es decir ");
    			em23 = element("em");
    			em23.textContent = "s-t";
    			t70 = text(" es una división de los vértices de la red de flujo en dos partes, una incluye a la fuente y la otra al destino. El grupo de cortes ");
    			em24 = element("em");
    			em24.textContent = "Xc";
    			t72 = text(" de un corte ");
    			em25 = element("em");
    			em25.textContent = "C";
    			t74 = text(" es un grupo de vértices que conectan la fuente con el destino.");
    			add_location(h1, file$e, 0, 0, 0);
    			add_location(p0, file$e, 1, 0, 48);
    			add_location(strong0, file$e, 2, 52, 397);
    			add_location(strong1, file$e, 2, 87, 432);
    			add_location(strong2, file$e, 2, 135, 480);
    			add_location(p1, file$e, 2, 0, 345);
    			add_location(h20, file$e, 3, 0, 509);
    			add_location(em0, file$e, 4, 16, 551);
    			add_location(em1, file$e, 4, 38, 573);
    			add_location(em2, file$e, 4, 86, 621);
    			add_location(em3, file$e, 4, 152, 687);
    			add_location(em4, file$e, 4, 203, 738);
    			add_location(em5, file$e, 4, 246, 781);
    			add_location(em6, file$e, 4, 307, 842);
    			add_location(em7, file$e, 4, 463, 998);
    			add_location(p2, file$e, 4, 0, 535);
    			add_location(h21, file$e, 5, 0, 1027);
    			add_location(em8, file$e, 6, 25, 1085);
    			add_location(em9, file$e, 6, 55, 1115);
    			add_location(em10, file$e, 6, 103, 1163);
    			add_location(em11, file$e, 6, 150, 1210);
    			add_location(em12, file$e, 6, 179, 1239);
    			add_location(em13, file$e, 6, 234, 1294);
    			add_location(em14, file$e, 6, 279, 1339);
    			add_location(em15, file$e, 6, 310, 1370);
    			add_location(p3, file$e, 6, 0, 1060);
    			add_location(h22, file$e, 7, 0, 1392);
    			add_location(em16, file$e, 8, 12, 1420);
    			add_location(em17, file$e, 8, 25, 1433);
    			add_location(em18, file$e, 8, 77, 1485);
    			add_location(em19, file$e, 8, 96, 1504);
    			add_location(em20, file$e, 8, 113, 1521);
    			add_location(em21, file$e, 8, 135, 1543);
    			add_location(em22, file$e, 8, 148, 1556);
    			add_location(em23, file$e, 8, 230, 1638);
    			add_location(em24, file$e, 8, 374, 1782);
    			add_location(em25, file$e, 8, 398, 1806);
    			add_location(p4, file$e, 8, 0, 1408);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t4);
    			append_dev(p1, strong0);
    			append_dev(p1, t6);
    			append_dev(p1, strong1);
    			append_dev(p1, t8);
    			append_dev(p1, strong2);
    			append_dev(p1, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t14);
    			append_dev(p2, em0);
    			append_dev(p2, t16);
    			append_dev(p2, em1);
    			append_dev(p2, t18);
    			append_dev(p2, em2);
    			append_dev(p2, t20);
    			append_dev(p2, em3);
    			append_dev(p2, t22);
    			append_dev(p2, em4);
    			append_dev(p2, t24);
    			append_dev(p2, em5);
    			append_dev(p2, t26);
    			append_dev(p2, em6);
    			append_dev(p2, t28);
    			append_dev(p2, em7);
    			append_dev(p2, t30);
    			insert_dev(target, t31, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t33, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t34);
    			append_dev(p3, em8);
    			append_dev(p3, t36);
    			append_dev(p3, em9);
    			append_dev(p3, t38);
    			append_dev(p3, em10);
    			append_dev(p3, t40);
    			append_dev(p3, em11);
    			append_dev(p3, t42);
    			append_dev(p3, em12);
    			append_dev(p3, t44);
    			append_dev(p3, em13);
    			append_dev(p3, t46);
    			append_dev(p3, em14);
    			append_dev(p3, t48);
    			append_dev(p3, em15);
    			append_dev(p3, t50);
    			insert_dev(target, t51, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t53, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t54);
    			append_dev(p4, em16);
    			append_dev(p4, t56);
    			append_dev(p4, em17);
    			append_dev(p4, t58);
    			append_dev(p4, em18);
    			append_dev(p4, t60);
    			append_dev(p4, em19);
    			append_dev(p4, t62);
    			append_dev(p4, em20);
    			append_dev(p4, t64);
    			append_dev(p4, em21);
    			append_dev(p4, t66);
    			append_dev(p4, em22);
    			append_dev(p4, t68);
    			append_dev(p4, em23);
    			append_dev(p4, t70);
    			append_dev(p4, em24);
    			append_dev(p4, t72);
    			append_dev(p4, em25);
    			append_dev(p4, t74);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t33);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t51);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t53);
    			if (detaching) detach_dev(p4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META$1 = {};

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TeoremaFMCM', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TeoremaFMCM> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META: META$1 });
    	return [];
    }

    class TeoremaFMCM extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TeoremaFMCM",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/components/Ayuda/Items/FlujoMaximo/AlgoritmoFordFulkerson.md generated by Svelte v3.48.0 */

    const file$d = "src/components/Ayuda/Items/FlujoMaximo/AlgoritmoFordFulkerson.md";

    function create_fragment$d(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let ol;
    	let li0;
    	let t6;
    	let em0;
    	let t8;
    	let t9;
    	let li1;
    	let t10;
    	let em1;
    	let t12;
    	let em2;
    	let t14;
    	let t15;
    	let li2;
    	let t16;
    	let em3;
    	let t18;
    	let t19;
    	let p2;
    	let t20;
    	let em4;
    	let t22;
    	let em5;
    	let t24;
    	let em6;
    	let t26;
    	let t27;
    	let p3;
    	let t28;
    	let em7;
    	let t30;
    	let em10;
    	let t31;
    	let em8;
    	let t33;
    	let em9;
    	let t35;
    	let t36;
    	let h2;
    	let t38;
    	let p4;
    	let t39;
    	let strong0;
    	let t41;
    	let strong1;
    	let t43;
    	let t44;
    	let p5;
    	let t45;
    	let em11;
    	let t47;
    	let em12;
    	let t49;
    	let em13;
    	let t51;
    	let t52;
    	let p6;
    	let t53;
    	let a;
    	let strong2;
    	let t55;
    	let t56;
    	let p7;
    	let t57;
    	let em14;
    	let t59;
    	let strong3;
    	let t61;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Algoritmo de Ford-Fulkerson";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Utilizando el teorema de flujo máximo y corte mínimo, se puede construir un algoritmo para encontrar el flujo máximo en una red de flujo. Este algoritmo se conoce como el algoritmo de Ford-Fulkerson.";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "El algoritmo se basa en repetir el siguiente proceso:";
    			t5 = space();
    			ol = element("ol");
    			li0 = element("li");
    			t6 = text("Construir una red residual ");
    			em0 = element("em");
    			em0.textContent = "Gf";
    			t8 = text(".");
    			t9 = space();
    			li1 = element("li");
    			t10 = text("Encontrar una trayectoria de aumento ");
    			em1 = element("em");
    			em1.textContent = "p";
    			t12 = text(" en ");
    			em2 = element("em");
    			em2.textContent = "Gf";
    			t14 = text(".");
    			t15 = space();
    			li2 = element("li");
    			t16 = text("Aumentar el flujo en ");
    			em3 = element("em");
    			em3.textContent = "p";
    			t18 = text(".");
    			t19 = space();
    			p2 = element("p");
    			t20 = text("El algoritmo termina cuando no exista una trayectoria de aumento en ");
    			em4 = element("em");
    			em4.textContent = "Gf";
    			t22 = text(". El flujo máximo en ");
    			em5 = element("em");
    			em5.textContent = "G";
    			t24 = text(" es igual a la suma de los flujos en las aristas de la red residual ");
    			em6 = element("em");
    			em6.textContent = "Gf";
    			t26 = text(".");
    			t27 = space();
    			p3 = element("p");
    			t28 = text("La complejidad del algoritmo de Ford-Fulkerson es de ");
    			em7 = element("em");
    			em7.textContent = "O(|E| ⋅ f\\";
    			t30 = text(")");
    			em10 = element("em");
    			t31 = text(", donde ");
    			em8 = element("em");
    			em8.textContent = "|E|";
    			t33 = text(" es el número de aristas y ");
    			em9 = element("em");
    			em9.textContent = "f\\";
    			t35 = text(" es el flujo máximo.");
    			t36 = space();
    			h2 = element("h2");
    			h2.textContent = "Algoritmo de Edmonds-Karp";
    			t38 = space();
    			p4 = element("p");
    			t39 = text("Originalmente el algoritmo de Ford-Fulkerson utiliza una búsqueda en profundidad para encontrar una trayectoria de aumento en la red residual ");
    			strong0 = element("strong");
    			strong0.textContent = "(DFS)";
    			t41 = text(". Sin embargo, este algoritmo puede ser mejorado utilizando una búsqueda en amplitud ");
    			strong1 = element("strong");
    			strong1.textContent = "(BFS)";
    			t43 = text(", el cual se conoce como el algoritmo de Edmonds-Karp.");
    			t44 = space();
    			p5 = element("p");
    			t45 = text("Al realizar esta modificación, la complejidad del algoritmo de Edmonds-Karp es de ");
    			em11 = element("em");
    			em11.textContent = "O(|V| ⋅ |E|^2)";
    			t47 = text(", donde ");
    			em12 = element("em");
    			em12.textContent = "|V|";
    			t49 = text(" es el número de vértices y ");
    			em13 = element("em");
    			em13.textContent = "|E|";
    			t51 = text(" es el número de aristas.");
    			t52 = space();
    			p6 = element("p");
    			t53 = text("Cabe destacar que en este algoritmo, la complejidad no depende de la variable de flujo maximo y por lo tanto es un algoritmo ");
    			a = element("a");
    			strong2 = element("strong");
    			strong2.textContent = "fuertemente polinomial";
    			t55 = text(".");
    			t56 = space();
    			p7 = element("p");
    			t57 = text("De forma paralela el científico soviético Yefim Dinitz en 1970 de forma independiente, logró desarrollar un algoritmo ");
    			em14 = element("em");
    			em14.textContent = "O(|V| ⋅ |E|^2)";
    			t59 = text(" para encontrar el flujo máximo en una red de flujo, el cual se conoce como el algoritmo de Dinitz. Al igual que el algoritmo de Edmonds-Karp, este algoritmo utiliza una búsqueda en amplitud ");
    			strong3 = element("strong");
    			strong3.textContent = "(BFS)";
    			t61 = text(" para encontrar una trayectoria de aumento en la red residual.");
    			add_location(h1, file$d, 0, 0, 0);
    			add_location(p0, file$d, 1, 0, 37);
    			add_location(p1, file$d, 2, 0, 244);
    			add_location(em0, file$d, 4, 31, 341);
    			add_location(li0, file$d, 4, 0, 310);
    			add_location(em1, file$d, 5, 41, 400);
    			add_location(em2, file$d, 5, 55, 414);
    			add_location(li1, file$d, 5, 0, 359);
    			add_location(em3, file$d, 6, 25, 457);
    			add_location(li2, file$d, 6, 0, 432);
    			add_location(ol, file$d, 3, 0, 305);
    			add_location(em4, file$d, 8, 71, 551);
    			add_location(em5, file$d, 8, 103, 583);
    			add_location(em6, file$d, 8, 181, 661);
    			add_location(p2, file$d, 8, 0, 480);
    			add_location(em7, file$d, 9, 56, 734);
    			add_location(em8, file$d, 9, 88, 766);
    			add_location(em9, file$d, 9, 127, 805);
    			add_location(em10, file$d, 9, 76, 754);
    			add_location(p3, file$d, 9, 0, 678);
    			add_location(h2, file$d, 10, 0, 846);
    			add_location(strong0, file$d, 11, 145, 1026);
    			add_location(strong1, file$d, 11, 252, 1133);
    			add_location(p4, file$d, 11, 0, 881);
    			add_location(em11, file$d, 12, 85, 1299);
    			add_location(em12, file$d, 12, 116, 1330);
    			add_location(em13, file$d, 12, 156, 1370);
    			add_location(p5, file$d, 12, 0, 1214);
    			add_location(strong2, file$d, 13, 227, 1639);
    			attr_dev(a, "href", "https://es.wikipedia.org/wiki/Complejidad_temporal#Tiempo_polinomial_fuerte_y_d%C3%A9bil");
    			add_location(a, file$d, 13, 128, 1540);
    			add_location(p6, file$d, 13, 0, 1412);
    			add_location(em14, file$d, 14, 121, 1809);
    			add_location(strong3, file$d, 14, 335, 2023);
    			add_location(p7, file$d, 14, 0, 1688);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, ol, anchor);
    			append_dev(ol, li0);
    			append_dev(li0, t6);
    			append_dev(li0, em0);
    			append_dev(li0, t8);
    			append_dev(ol, t9);
    			append_dev(ol, li1);
    			append_dev(li1, t10);
    			append_dev(li1, em1);
    			append_dev(li1, t12);
    			append_dev(li1, em2);
    			append_dev(li1, t14);
    			append_dev(ol, t15);
    			append_dev(ol, li2);
    			append_dev(li2, t16);
    			append_dev(li2, em3);
    			append_dev(li2, t18);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t20);
    			append_dev(p2, em4);
    			append_dev(p2, t22);
    			append_dev(p2, em5);
    			append_dev(p2, t24);
    			append_dev(p2, em6);
    			append_dev(p2, t26);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t28);
    			append_dev(p3, em7);
    			append_dev(p3, t30);
    			append_dev(p3, em10);
    			append_dev(em10, t31);
    			append_dev(em10, em8);
    			append_dev(em10, t33);
    			append_dev(em10, em9);
    			append_dev(p3, t35);
    			insert_dev(target, t36, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t38, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t39);
    			append_dev(p4, strong0);
    			append_dev(p4, t41);
    			append_dev(p4, strong1);
    			append_dev(p4, t43);
    			insert_dev(target, t44, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, t45);
    			append_dev(p5, em11);
    			append_dev(p5, t47);
    			append_dev(p5, em12);
    			append_dev(p5, t49);
    			append_dev(p5, em13);
    			append_dev(p5, t51);
    			insert_dev(target, t52, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, t53);
    			append_dev(p6, a);
    			append_dev(a, strong2);
    			append_dev(p6, t55);
    			insert_dev(target, t56, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, t57);
    			append_dev(p7, em14);
    			append_dev(p7, t59);
    			append_dev(p7, strong3);
    			append_dev(p7, t61);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(ol);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t36);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t38);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t44);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t52);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t56);
    			if (detaching) detach_dev(p7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const META = {};

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AlgoritmoFordFulkerson', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AlgoritmoFordFulkerson> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ META });
    	return [];
    }

    class AlgoritmoFordFulkerson extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AlgoritmoFordFulkerson",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/components/Ayuda/Ayuda.svelte generated by Svelte v3.48.0 */

    const file$c = "src/components/Ayuda/Ayuda.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (107:20) {#each categoria.items as item, indexItem}
    function create_each_block_1$2(ctx) {
    	let button;
    	let p;
    	let t0_value = /*indexCategoria*/ ctx[8] + 1 + "";
    	let t0;
    	let t1;
    	let t2_value = /*indexItem*/ ctx[11] + 1 + "";
    	let t2;
    	let t3;
    	let t4_value = /*item*/ ctx[9].titulo + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*indexCategoria*/ ctx[8], /*indexItem*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text("-");
    			t2 = text(t2_value);
    			t3 = text(".- ");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(p, "class", "text-base font-medium text-left svelte-1dl9qh1");
    			add_location(p, file$c, 108, 28, 3907);
    			attr_dev(button, "class", "h-12 w-full p-2 svelte-1dl9qh1");
    			add_location(button, file$c, 107, 24, 3788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, p);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(button, t5);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(107:20) {#each categoria.items as item, indexItem}",
    		ctx
    	});

    	return block;
    }

    // (98:8) {#each itemsAyuda.categorias as categoria, indexCategoria}
    function create_each_block$4(ctx) {
    	let div2;
    	let div0;
    	let p;
    	let t0_value = /*indexCategoria*/ ctx[8] + 1 + "";
    	let t0;
    	let t1;
    	let t2_value = /*categoria*/ ctx[6].titulo + "";
    	let t2;
    	let t3;
    	let hr;
    	let t4;
    	let div1;
    	let t5;
    	let each_value_1 = /*categoria*/ ctx[6].items;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text(" .- ");
    			t2 = text(t2_value);
    			t3 = space();
    			hr = element("hr");
    			t4 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			attr_dev(p, "class", "text-lg font-semibold text-left svelte-1dl9qh1");
    			add_location(p, file$c, 100, 20, 3435);
    			attr_dev(div0, "class", "w-full h-12 p-2 svelte-1dl9qh1");
    			add_location(div0, file$c, 99, 16, 3385);
    			attr_dev(hr, "class", "w-full bg-black svelte-1dl9qh1");
    			add_location(hr, file$c, 104, 16, 3610);
    			attr_dev(div1, "class", "flex flex-col w-full divide-y svelte-1dl9qh1");
    			add_location(div1, file$c, 105, 16, 3657);
    			attr_dev(div2, "class", "w-full svelte-1dl9qh1");
    			add_location(div2, file$c, 98, 12, 3348);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(div2, t3);
    			append_dev(div2, hr);
    			append_dev(div2, t4);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div2, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*onClickItem, itemsAyuda*/ 6) {
    				each_value_1 = /*categoria*/ ctx[6].items;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(98:8) {#each itemsAyuda.categorias as categoria, indexCategoria}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let article;
    	let switch_instance;
    	let current;
    	let each_value = /*itemsAyuda*/ ctx[1].categorias;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	var switch_value = /*componenteSeleccionado*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div1 = element("div");
    			article = element("article");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", "w-1/4 h-full flex flex-col divide-y overflow-x-hidden overflow-y-scroll whitespace-nowrap svelte-1dl9qh1");
    			add_location(div0, file$c, 96, 4, 3165);
    			attr_dev(article, "class", "w-full h-full overflow-y-scroll px-6 svelte-1dl9qh1");
    			add_location(article, file$c, 118, 8, 4254);
    			attr_dev(div1, "class", "w-3/4 h-full pr-2 pt-8 pb-2 svelte-1dl9qh1");
    			add_location(div1, file$c, 117, 4, 4204);
    			attr_dev(div2, "style", "height: 38rem");
    			attr_dev(div2, "class", "w-full flex flex-row divide-x overflow-hidden svelte-1dl9qh1");
    			add_location(div2, file$c, 95, 0, 3077);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);
    			append_dev(div1, article);

    			if (switch_instance) {
    				mount_component(switch_instance, article, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*itemsAyuda, onClickItem*/ 6) {
    				each_value = /*itemsAyuda*/ ctx[1].categorias;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (switch_value !== (switch_value = /*componenteSeleccionado*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, article, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ayuda', slots, []);

    	const itemsAyuda = {
    		categorias: [
    			{
    				titulo: "Entendiendo la aplicación",
    				items: [
    					{ titulo: "Interfaz", componente: Interfaz },
    					{
    						titulo: "Menú superior",
    						componente: MenuSuperior
    					},
    					{
    						titulo: "Grafo",
    						componente: SeccionGrafo
    					},
    					{
    						titulo: "Sección inferior",
    						componente: SeccionInferior
    					}
    				]
    			},
    			{
    				titulo: "Conceptos básicos de un grafo",
    				items: [
    					{ titulo: "Grafo", componente: Grafo$1 },
    					{
    						titulo: "Matriz de adyacencia",
    						componente: MatrizAdyacencia
    					},
    					{
    						titulo: "Grafo dirigido",
    						componente: GrafoDirigido
    					}
    				]
    			},
    			{
    				titulo: "Concetos del flujo maximo",
    				items: [
    					{
    						titulo: "Red de flujo",
    						componente: RedDeFlujo
    					},
    					{
    						titulo: "Problema de flujo maximo",
    						componente: ProblemaFlujoMaximo
    					},
    					{
    						titulo: "Teorema de flujo máximo y corte mínimo",
    						componente: TeoremaFMCM
    					},
    					{
    						titulo: "Algoritmo de Ford-Fulkerson",
    						componente: AlgoritmoFordFulkerson
    					}
    				]
    			}
    		]
    	};

    	let categoriaSeleccionada = 0;
    	let itemSeleccionado = 0;
    	let componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente;

    	function onClickItem(indexCategoria, indexItem) {
    		categoriaSeleccionada = indexCategoria;
    		itemSeleccionado = indexItem;
    		$$invalidate(0, componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Ayuda> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (indexCategoria, indexItem) => {
    		onClickItem(indexCategoria, indexItem);
    	};

    	$$self.$capture_state = () => ({
    		Interfaz,
    		MenuSuperior,
    		SeccionGrafo,
    		SeccionInferior,
    		Grafo: Grafo$1,
    		MatrizAdyacencia,
    		GrafoDirigido,
    		RedDeFlujo,
    		ProblemaFlujoMaximo,
    		TeoremaFMCM,
    		AlgoritmoFordFulkerson,
    		itemsAyuda,
    		categoriaSeleccionada,
    		itemSeleccionado,
    		componenteSeleccionado,
    		onClickItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('categoriaSeleccionada' in $$props) categoriaSeleccionada = $$props.categoriaSeleccionada;
    		if ('itemSeleccionado' in $$props) itemSeleccionado = $$props.itemSeleccionado;
    		if ('componenteSeleccionado' in $$props) $$invalidate(0, componenteSeleccionado = $$props.componenteSeleccionado);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [componenteSeleccionado, itemsAyuda, onClickItem, click_handler];
    }

    class Ayuda extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ayuda",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/Menu/ModeSwitcher.svelte generated by Svelte v3.48.0 */
    const file$b = "src/components/Menu/ModeSwitcher.svelte";

    // (25:2) {:else}
    function create_else_block$5(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M256 144C194.1 144 144 194.1 144 256c0 61.86 50.14 112 112 112s112-50.14 112-112C368 194.1 317.9 144 256 144zM256 320c-35.29 0-64-28.71-64-64c0-35.29 28.71-64 64-64s64 28.71 64 64C320 291.3 291.3 320 256 320zM256 112c13.25 0 24-10.75 24-24v-64C280 10.75 269.3 0 256 0S232 10.75 232 24v64C232 101.3 242.8 112 256 112zM256 400c-13.25 0-24 10.75-24 24v64C232 501.3 242.8 512 256 512s24-10.75 24-24v-64C280 410.8 269.3 400 256 400zM488 232h-64c-13.25 0-24 10.75-24 24s10.75 24 24 24h64C501.3 280 512 269.3 512 256S501.3 232 488 232zM112 256c0-13.25-10.75-24-24-24h-64C10.75 232 0 242.8 0 256s10.75 24 24 24h64C101.3 280 112 269.3 112 256zM391.8 357.8c-9.344-9.375-24.56-9.372-33.94 .0031s-9.375 24.56 0 33.93l45.25 45.28c4.672 4.688 10.83 7.031 16.97 7.031s12.28-2.344 16.97-7.031c9.375-9.375 9.375-24.56 0-33.94L391.8 357.8zM120.2 154.2c4.672 4.688 10.83 7.031 16.97 7.031S149.5 158.9 154.2 154.2c9.375-9.375 9.375-24.56 0-33.93L108.9 74.97c-9.344-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L120.2 154.2zM374.8 161.2c6.141 0 12.3-2.344 16.97-7.031l45.25-45.28c9.375-9.375 9.375-24.56 0-33.94s-24.59-9.375-33.94 0l-45.25 45.28c-9.375 9.375-9.375 24.56 0 33.93C362.5 158.9 368.7 161.2 374.8 161.2zM120.2 357.8l-45.25 45.28c-9.375 9.375-9.375 24.56 0 33.94c4.688 4.688 10.83 7.031 16.97 7.031s12.3-2.344 16.97-7.031l45.25-45.28c9.375-9.375 9.375-24.56 0-33.93S129.6 348.4 120.2 357.8z");
    			add_location(path, file$b, 25, 198, 1643);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "data-prefix", "far");
    			attr_dev(svg, "data-icon", "sun");
    			attr_dev(svg, "class", "svg-inline--fa fa-sun fa-w-16 fill-gray-900");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$b, 25, 2, 1447);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(25:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if darkMode}
    function create_if_block$6(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M279.135 512c78.756 0 150.982-35.804 198.844-94.775 28.27-34.831-2.558-85.722-46.249-77.401-82.348 15.683-158.272-47.268-158.272-130.792 0-48.424 26.06-92.292 67.434-115.836 38.745-22.05 28.999-80.788-15.022-88.919A257.936 257.936 0 0 0 279.135 0c-141.36 0-256 114.575-256 256 0 141.36 114.576 256 256 256zm0-464c12.985 0 25.689 1.201 38.016 3.478-54.76 31.163-91.693 90.042-91.693 157.554 0 113.848 103.641 199.2 215.252 177.944C402.574 433.964 344.366 464 279.135 464c-114.875 0-208-93.125-208-208s93.125-208 208-208z");
    			add_location(path, file$b, 23, 197, 891);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "data-prefix", "far");
    			attr_dev(svg, "data-icon", "moon");
    			attr_dev(svg, "class", "svg-inline--fa fa-moon fa-w-16 fill-white");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$b, 23, 2, 696);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(23:2) {#if darkMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*darkMode*/ ctx[0]) return create_if_block$6;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "w-6 h-6 ");
    			add_location(div, file$b, 21, 0, 632);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*toggleMode*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const THEME_KEY = 'themePreference';

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModeSwitcher', slots, []);
    	let darkMode = false;

    	function setDarkTheme(dark) {
    		$$invalidate(0, darkMode = dark);
    		document.documentElement.classList.toggle('dark', darkMode);
    	}

    	function toggleMode() {
    		setDarkTheme(!darkMode);
    		window.localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
    	}

    	onMount(() => {
    		const theme = window.localStorage.getItem(THEME_KEY);

    		if (theme === 'dark') {
    			setDarkTheme(true);
    		} else if (theme == null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    			setDarkTheme(true);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModeSwitcher> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		darkMode,
    		THEME_KEY,
    		setDarkTheme,
    		toggleMode
    	});

    	$$self.$inject_state = $$props => {
    		if ('darkMode' in $$props) $$invalidate(0, darkMode = $$props.darkMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [darkMode, toggleMode];
    }

    class ModeSwitcher extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModeSwitcher",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/components/Menu/Menu.svelte generated by Svelte v3.48.0 */
    const file$a = "src/components/Menu/Menu.svelte";

    function create_fragment$a(ctx) {
    	let div10;
    	let div8;
    	let button0;
    	let t1;
    	let div0;
    	let button1;
    	let t2;
    	let button1_disabled_value;
    	let t3;
    	let button2;
    	let t4;
    	let button2_disabled_value;
    	let t5;
    	let button3;
    	let t6;
    	let button3_disabled_value;
    	let t7;
    	let div1;
    	let button4;
    	let t8;
    	let button4_disabled_value;
    	let t9;
    	let button5;
    	let t11;
    	let button6;
    	let t12;
    	let button6_disabled_value;
    	let t13;
    	let div4;
    	let button7;
    	let t14;
    	let div2;
    	let button7_disabled_value;
    	let t16;
    	let button8;
    	let t17;
    	let div3;
    	let button8_disabled_value;
    	let t19;
    	let div7;
    	let button9;
    	let t20;
    	let div5;
    	let button9_disabled_value;
    	let t22;
    	let button10;
    	let t23;
    	let div6;
    	let button10_disabled_value;
    	let t25;
    	let div9;
    	let modeswitcher;
    	let current;
    	let mounted;
    	let dispose;
    	modeswitcher = new ModeSwitcher({ $$inline: true });

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div8 = element("div");
    			button0 = element("button");
    			button0.textContent = "?";
    			t1 = space();
    			div0 = element("div");
    			button1 = element("button");
    			t2 = text("▶️");
    			t3 = space();
    			button2 = element("button");
    			t4 = text("⏯️");
    			t5 = space();
    			button3 = element("button");
    			t6 = text("⏹️");
    			t7 = space();
    			div1 = element("div");
    			button4 = element("button");
    			t8 = text("🎲");
    			t9 = space();
    			button5 = element("button");
    			button5.textContent = "💾";
    			t11 = space();
    			button6 = element("button");
    			t12 = text("📁");
    			t13 = space();
    			div4 = element("div");
    			button7 = element("button");
    			t14 = text("🔵\n                ");
    			div2 = element("div");
    			div2.textContent = "✨";
    			t16 = space();
    			button8 = element("button");
    			t17 = text("🔗\n                ");
    			div3 = element("div");
    			div3.textContent = "✨";
    			t19 = space();
    			div7 = element("div");
    			button9 = element("button");
    			t20 = text("🔵\n                ");
    			div5 = element("div");
    			div5.textContent = "❌";
    			t22 = space();
    			button10 = element("button");
    			t23 = text("🔗\n                ");
    			div6 = element("div");
    			div6.textContent = "❌";
    			t25 = space();
    			div9 = element("div");
    			create_component(modeswitcher.$$.fragment);
    			attr_dev(button0, "title", "Ayuda");
    			attr_dev(button0, "class", "bg-indigo-600 w-8 h-8 rounded-lg ");
    			add_location(button0, file$a, 103, 8, 3695);
    			attr_dev(button1, "title", "Iniciar Algoritmo de Flujo Maximo");
    			button1.disabled = button1_disabled_value = !/*puedeIniciarFlujoMaximo*/ ctx[3];
    			attr_dev(button1, "class", "disabled:grayscale");
    			add_location(button1, file$a, 107, 12, 3882);
    			attr_dev(button2, "title", "Avanzar Algoritmo de Flujo Maximo");
    			button2.disabled = button2_disabled_value = !/*puedeContinuarFlujoMaximo*/ ctx[2];
    			attr_dev(button2, "class", "disabled:grayscale");
    			add_location(button2, file$a, 110, 12, 4081);
    			attr_dev(button3, "title", "Detener Algoritmo de Flujo Maximo");
    			button3.disabled = button3_disabled_value = !/*puedeDetenerFlujoMaximo*/ ctx[1];
    			attr_dev(button3, "class", "disabled:grayscale");
    			add_location(button3, file$a, 113, 12, 4281);
    			attr_dev(div0, "class", "flex my-auto text-2xl space-x-4");
    			add_location(div0, file$a, 106, 8, 3824);
    			attr_dev(button4, "title", "Generar Grafo Aleatorio");
    			button4.disabled = button4_disabled_value = !/*puedeModificarGrafo*/ ctx[0];
    			attr_dev(button4, "class", "disabled:grayscale");
    			add_location(button4, file$a, 118, 12, 4548);
    			attr_dev(button5, "title", "Guardar Grafo");
    			attr_dev(button5, "class", "disabled:grayscale");
    			add_location(button5, file$a, 121, 12, 4742);
    			attr_dev(button6, "title", "Cargar Grafo");
    			button6.disabled = button6_disabled_value = !/*puedeModificarGrafo*/ ctx[0];
    			attr_dev(button6, "class", "disabled:grayscale");
    			add_location(button6, file$a, 124, 12, 4884);
    			attr_dev(div1, "class", "flex my-auto text-2xl space-x-4");
    			add_location(div1, file$a, 117, 8, 4490);
    			attr_dev(div2, "class", "absolute bottom-1 ml-3 text-base");
    			add_location(div2, file$a, 131, 16, 5288);
    			attr_dev(button7, "title", "Agregar Vertice");
    			button7.disabled = button7_disabled_value = !/*puedeModificarGrafo*/ ctx[0];
    			attr_dev(button7, "class", "disabled:grayscale");
    			add_location(button7, file$a, 129, 12, 5125);
    			attr_dev(div3, "class", "absolute bottom-1 ml-3 text-base");
    			add_location(div3, file$a, 137, 16, 5576);
    			attr_dev(button8, "title", "Agregar Arista");
    			button8.disabled = button8_disabled_value = !/*puedeModificarGrafo*/ ctx[0];
    			attr_dev(button8, "class", "disabled:grayscale");
    			add_location(button8, file$a, 135, 12, 5415);
    			attr_dev(div4, "class", "flex my-auto text-2xl space-x-4");
    			add_location(div4, file$a, 128, 8, 5067);
    			attr_dev(div5, "class", "absolute bottom-1 ml-3 text-base");
    			add_location(div5, file$a, 145, 16, 5934);
    			attr_dev(button9, "title", "Eliminar Vertice");
    			button9.disabled = button9_disabled_value = !/*puedeModificarGrafo*/ ctx[0];
    			attr_dev(button9, "class", "disabled:grayscale");
    			add_location(button9, file$a, 143, 12, 5772);
    			attr_dev(div6, "class", "absolute bottom-1 ml-3 text-base");
    			add_location(div6, file$a, 151, 16, 6221);
    			attr_dev(button10, "title", "Eliminar Arista");
    			button10.disabled = button10_disabled_value = !/*puedeModificarGrafo*/ ctx[0];
    			attr_dev(button10, "class", "disabled:grayscale");
    			add_location(button10, file$a, 149, 12, 6061);
    			attr_dev(div7, "class", "flex my-auto text-2xl space-x-4");
    			add_location(div7, file$a, 142, 8, 5714);
    			attr_dev(div8, "class", "flex my-auto ml-2 text-2xl text-center space-x-10 px-2 w-full text-white");
    			add_location(div8, file$a, 102, 4, 3560);
    			attr_dev(div9, "class", "my-auto ml-auto mr-4");
    			add_location(div9, file$a, 157, 4, 6366);
    			attr_dev(div10, "class", "w-full h-10 bg-slate-700 dark:bg-gray-900 flex");
    			add_location(div10, file$a, 101, 0, 3495);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div8);
    			append_dev(div8, button0);
    			append_dev(div8, t1);
    			append_dev(div8, div0);
    			append_dev(div0, button1);
    			append_dev(button1, t2);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(button2, t4);
    			append_dev(div0, t5);
    			append_dev(div0, button3);
    			append_dev(button3, t6);
    			append_dev(div8, t7);
    			append_dev(div8, div1);
    			append_dev(div1, button4);
    			append_dev(button4, t8);
    			append_dev(div1, t9);
    			append_dev(div1, button5);
    			append_dev(div1, t11);
    			append_dev(div1, button6);
    			append_dev(button6, t12);
    			append_dev(div8, t13);
    			append_dev(div8, div4);
    			append_dev(div4, button7);
    			append_dev(button7, t14);
    			append_dev(button7, div2);
    			append_dev(div4, t16);
    			append_dev(div4, button8);
    			append_dev(button8, t17);
    			append_dev(button8, div3);
    			append_dev(div8, t19);
    			append_dev(div8, div7);
    			append_dev(div7, button9);
    			append_dev(button9, t20);
    			append_dev(button9, div5);
    			append_dev(div7, t22);
    			append_dev(div7, button10);
    			append_dev(button10, t23);
    			append_dev(button10, div6);
    			append_dev(div10, t25);
    			append_dev(div10, div9);
    			mount_component(modeswitcher, div9, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*onClickAyuda*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*onClickIniciarFlujo*/ ctx[5], false, false, false),
    					listen_dev(button2, "click", /*onClickAvanzarFlujo*/ ctx[6], false, false, false),
    					listen_dev(button3, "click", /*onClickDetenerFlujo*/ ctx[7], false, false, false),
    					listen_dev(button4, "click", /*onClickGenerarGrafoAleatorio*/ ctx[8], false, false, false),
    					listen_dev(button5, "click", /*onClickGuardarGrafo*/ ctx[9], false, false, false),
    					listen_dev(button6, "click", /*onClickCargarGrafo*/ ctx[10], false, false, false),
    					listen_dev(button7, "click", /*onClickCrearNuevoVertice*/ ctx[11], false, false, false),
    					listen_dev(button8, "click", /*onClickCrearNuevaArista*/ ctx[12], false, false, false),
    					listen_dev(button9, "click", /*onClickEliminarVertice*/ ctx[13], false, false, false),
    					listen_dev(button10, "click", /*onClickEliminarArista*/ ctx[14], false, false, false),
    					action_destroyer(twemoji_2.call(null, div8, { className: 'emoji-menu' }))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*puedeIniciarFlujoMaximo*/ 8 && button1_disabled_value !== (button1_disabled_value = !/*puedeIniciarFlujoMaximo*/ ctx[3])) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (!current || dirty & /*puedeContinuarFlujoMaximo*/ 4 && button2_disabled_value !== (button2_disabled_value = !/*puedeContinuarFlujoMaximo*/ ctx[2])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (!current || dirty & /*puedeDetenerFlujoMaximo*/ 2 && button3_disabled_value !== (button3_disabled_value = !/*puedeDetenerFlujoMaximo*/ ctx[1])) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}

    			if (!current || dirty & /*puedeModificarGrafo*/ 1 && button4_disabled_value !== (button4_disabled_value = !/*puedeModificarGrafo*/ ctx[0])) {
    				prop_dev(button4, "disabled", button4_disabled_value);
    			}

    			if (!current || dirty & /*puedeModificarGrafo*/ 1 && button6_disabled_value !== (button6_disabled_value = !/*puedeModificarGrafo*/ ctx[0])) {
    				prop_dev(button6, "disabled", button6_disabled_value);
    			}

    			if (!current || dirty & /*puedeModificarGrafo*/ 1 && button7_disabled_value !== (button7_disabled_value = !/*puedeModificarGrafo*/ ctx[0])) {
    				prop_dev(button7, "disabled", button7_disabled_value);
    			}

    			if (!current || dirty & /*puedeModificarGrafo*/ 1 && button8_disabled_value !== (button8_disabled_value = !/*puedeModificarGrafo*/ ctx[0])) {
    				prop_dev(button8, "disabled", button8_disabled_value);
    			}

    			if (!current || dirty & /*puedeModificarGrafo*/ 1 && button9_disabled_value !== (button9_disabled_value = !/*puedeModificarGrafo*/ ctx[0])) {
    				prop_dev(button9, "disabled", button9_disabled_value);
    			}

    			if (!current || dirty & /*puedeModificarGrafo*/ 1 && button10_disabled_value !== (button10_disabled_value = !/*puedeModificarGrafo*/ ctx[0])) {
    				prop_dev(button10, "disabled", button10_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modeswitcher.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modeswitcher.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(modeswitcher);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let estaEjecutandoFlujoMaximo;
    	let estaModificandoGrafo;
    	let puedeIniciarFlujoMaximo;
    	let puedeContinuarFlujoMaximo;
    	let puedeDetenerFlujoMaximo;
    	let puedeModificarGrafo;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	const { open } = getContext('simple-modal');
    	let { grafo } = $$props;

    	function onClickAyuda() {
    		open(Ayuda);
    	}

    	function onClickIniciarFlujo() {
    		if (!puedeIniciarFlujoMaximo) return;
    		grafo.inciarFlujoMaximo();
    	}

    	function onClickAvanzarFlujo() {
    		if (!puedeContinuarFlujoMaximo) return;
    		grafo.continuarFlujoMaximo();
    	}

    	function onClickDetenerFlujo() {
    		if (!puedeDetenerFlujoMaximo) return;
    		grafo.finalizarFlujoMaximo();
    	}

    	function onClickGenerarGrafoAleatorio() {
    		if (!puedeModificarGrafo) return;
    		const numeroVertices = prompt("Ingrese el número de vértices del grafo");

    		if (numeroVertices === null || numeroVertices === "" || isNaN(Number(numeroVertices)) || Number(numeroVertices) < 1) {
    			alert("Ingrese un número válido");
    			return;
    		}

    		const confirmar = confirm("Esto eliminará el grafo actual, ¿desea continuar?");
    		if (!confirmar) return;
    		const numeroVerticesInt = Number(numeroVertices);
    		grafo.generarGrafoAlAzar(numeroVerticesInt);
    	}

    	function onClickGuardarGrafo() {
    		grafo.guardarGrafo();
    	}

    	function onClickCargarGrafo() {
    		if (!puedeModificarGrafo) return;

    		//leemos un archivo json
    		const input = document.createElement("input");

    		input.type = "file";
    		input.accept = "application/json";

    		input.onchange = e => {
    			const file = e.target.files[0];
    			const reader = new FileReader();

    			reader.onload = e => {
    				const json = JSON.parse(reader.result);
    				const matrizAdyacencia = json.matrizAdyacencia;

    				//revisamos los valores -1 en la matriz de adyacencia que corresponden a Infinity
    				for (let i = 0; i < matrizAdyacencia.length; i++) {
    					for (let j = 0; j < matrizAdyacencia[i].length; j++) {
    						if (matrizAdyacencia[i][j] === -1) {
    							matrizAdyacencia[i][j] = Infinity;
    						}
    					}
    				}

    				const posicionesVertices = json.posicionesVertices;
    				const fuentes = json.fuentes;
    				const sumideros = json.sumideros;
    				grafo.generarGrafo(matrizAdyacencia, posicionesVertices, fuentes, sumideros);
    				grafo.recargarGrafo();
    			};

    			reader.readAsText(file);
    		};

    		input.click();
    	}

    	function onClickCrearNuevoVertice() {
    		if (!puedeModificarGrafo) return;
    		grafo.iniciarCreacionVertice();
    	}

    	function onClickCrearNuevaArista() {
    		if (!puedeModificarGrafo) return;
    		grafo.iniciarCreacionArista();
    	}

    	function onClickEliminarVertice() {
    		if (!puedeModificarGrafo) return;
    		grafo.iniciarEliminacionVertice();
    	}

    	function onClickEliminarArista() {
    		if (!puedeModificarGrafo) return;
    		grafo.iniciarEliminacionArista();
    	}

    	const writable_props = ['grafo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('grafo' in $$props) $$invalidate(15, grafo = $$props.grafo);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		twemoji: twemoji_2,
    		Ayuda,
    		ModeSwitcher,
    		open,
    		grafo,
    		onClickAyuda,
    		onClickIniciarFlujo,
    		onClickAvanzarFlujo,
    		onClickDetenerFlujo,
    		onClickGenerarGrafoAleatorio,
    		onClickGuardarGrafo,
    		onClickCargarGrafo,
    		onClickCrearNuevoVertice,
    		onClickCrearNuevaArista,
    		onClickEliminarVertice,
    		onClickEliminarArista,
    		puedeModificarGrafo,
    		puedeDetenerFlujoMaximo,
    		puedeContinuarFlujoMaximo,
    		puedeIniciarFlujoMaximo,
    		estaModificandoGrafo,
    		estaEjecutandoFlujoMaximo
    	});

    	$$self.$inject_state = $$props => {
    		if ('grafo' in $$props) $$invalidate(15, grafo = $$props.grafo);
    		if ('puedeModificarGrafo' in $$props) $$invalidate(0, puedeModificarGrafo = $$props.puedeModificarGrafo);
    		if ('puedeDetenerFlujoMaximo' in $$props) $$invalidate(1, puedeDetenerFlujoMaximo = $$props.puedeDetenerFlujoMaximo);
    		if ('puedeContinuarFlujoMaximo' in $$props) $$invalidate(2, puedeContinuarFlujoMaximo = $$props.puedeContinuarFlujoMaximo);
    		if ('puedeIniciarFlujoMaximo' in $$props) $$invalidate(3, puedeIniciarFlujoMaximo = $$props.puedeIniciarFlujoMaximo);
    		if ('estaModificandoGrafo' in $$props) $$invalidate(16, estaModificandoGrafo = $$props.estaModificandoGrafo);
    		if ('estaEjecutandoFlujoMaximo' in $$props) $$invalidate(17, estaEjecutandoFlujoMaximo = $$props.estaEjecutandoFlujoMaximo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*grafo*/ 32768) {
    			$$invalidate(17, estaEjecutandoFlujoMaximo = grafo.ejecutandoFlujoMaximo);
    		}

    		if ($$self.$$.dirty & /*grafo*/ 32768) {
    			$$invalidate(16, estaModificandoGrafo = grafo.creandoArista || grafo.creandoVertice || grafo.eliminandoArista || grafo.eliminandoVertice);
    		}

    		if ($$self.$$.dirty & /*estaEjecutandoFlujoMaximo, estaModificandoGrafo*/ 196608) {
    			$$invalidate(3, puedeIniciarFlujoMaximo = !estaEjecutandoFlujoMaximo && !estaModificandoGrafo);
    		}

    		if ($$self.$$.dirty & /*estaEjecutandoFlujoMaximo*/ 131072) {
    			$$invalidate(2, puedeContinuarFlujoMaximo = estaEjecutandoFlujoMaximo);
    		}

    		if ($$self.$$.dirty & /*estaEjecutandoFlujoMaximo*/ 131072) {
    			$$invalidate(1, puedeDetenerFlujoMaximo = estaEjecutandoFlujoMaximo);
    		}

    		if ($$self.$$.dirty & /*estaEjecutandoFlujoMaximo, estaModificandoGrafo*/ 196608) {
    			$$invalidate(0, puedeModificarGrafo = !estaEjecutandoFlujoMaximo && !estaModificandoGrafo);
    		}
    	};

    	return [
    		puedeModificarGrafo,
    		puedeDetenerFlujoMaximo,
    		puedeContinuarFlujoMaximo,
    		puedeIniciarFlujoMaximo,
    		onClickAyuda,
    		onClickIniciarFlujo,
    		onClickAvanzarFlujo,
    		onClickDetenerFlujo,
    		onClickGenerarGrafoAleatorio,
    		onClickGuardarGrafo,
    		onClickCargarGrafo,
    		onClickCrearNuevoVertice,
    		onClickCrearNuevaArista,
    		onClickEliminarVertice,
    		onClickEliminarArista,
    		grafo,
    		estaModificandoGrafo,
    		estaEjecutandoFlujoMaximo
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { grafo: 15 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*grafo*/ ctx[15] === undefined && !('grafo' in props)) {
    			console.warn("<Menu> was created without expected prop 'grafo'");
    		}
    	}

    	get grafo() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set grafo(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Consola/Explicacion.svelte generated by Svelte v3.48.0 */
    const file$9 = "src/components/Consola/Explicacion.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (23:4) {#each textoExplicativo as linea}
    function create_each_block$3(ctx) {
    	let div;
    	let p;
    	let t0_value = /*linea*/ ctx[5] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "flex flex-row text-slate-900 text-sm font-medium");
    			add_location(p, file$9, 24, 16, 770);
    			attr_dev(div, "class", "min-h-12 py-3 mx-4 flex items-center text-clip");
    			add_location(div, file$9, 23, 12, 693);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = action_destroyer(twemoji_2.call(null, p, { className: 'emoji-explicacion' }));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*textoExplicativo*/ 1 && t0_value !== (t0_value = /*linea*/ ctx[5] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(23:4) {#each textoExplicativo as linea}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let each_value = /*textoExplicativo*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "overflow-auto ");
    			add_location(div, file$9, 21, 0, 592);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			/*div_binding*/ ctx[2](div);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*textoExplicativo*/ 1) {
    				each_value = /*textoExplicativo*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			/*div_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Explicacion', slots, []);
    	let { textoExplicativo } = $$props;
    	let prevTextoExplicativo;
    	let divScroll;

    	function autoScroll() {
    		if (divScroll) {
    			//console.log("autoscroll");
    			//console.log(divScroll.scrollHeight);
    			$$invalidate(1, divScroll.scrollTop = divScroll.scrollHeight, divScroll);
    		}
    	}

    	afterUpdate(() => {
    		const ultimoTexto = textoExplicativo[textoExplicativo.length - 1];

    		if (prevTextoExplicativo !== ultimoTexto) {
    			prevTextoExplicativo = ultimoTexto;
    			autoScroll();
    		}
    	});

    	const writable_props = ['textoExplicativo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Explicacion> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			divScroll = $$value;
    			$$invalidate(1, divScroll);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('textoExplicativo' in $$props) $$invalidate(0, textoExplicativo = $$props.textoExplicativo);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		twemoji: twemoji_2,
    		textoExplicativo,
    		prevTextoExplicativo,
    		divScroll,
    		autoScroll
    	});

    	$$self.$inject_state = $$props => {
    		if ('textoExplicativo' in $$props) $$invalidate(0, textoExplicativo = $$props.textoExplicativo);
    		if ('prevTextoExplicativo' in $$props) prevTextoExplicativo = $$props.prevTextoExplicativo;
    		if ('divScroll' in $$props) $$invalidate(1, divScroll = $$props.divScroll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [textoExplicativo, divScroll, div_binding];
    }

    class Explicacion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { textoExplicativo: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Explicacion",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*textoExplicativo*/ ctx[0] === undefined && !('textoExplicativo' in props)) {
    			console.warn("<Explicacion> was created without expected prop 'textoExplicativo'");
    		}
    	}

    	get textoExplicativo() {
    		throw new Error("<Explicacion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textoExplicativo(value) {
    		throw new Error("<Explicacion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Consola/Pseudocodigo.svelte generated by Svelte v3.48.0 */
    const file$8 = "src/components/Consola/Pseudocodigo.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (28:12) {:else}
    function create_else_block$4(ctx) {
    	let p;
    	let t_value = /*linea*/ ctx[6] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "text-slate-900 text-sm font-medium");
    			add_location(p, file$8, 28, 16, 870);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pseudoCodigo*/ 1 && t_value !== (t_value = /*linea*/ ctx[6] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(28:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:12) {#if lineaActual === index}
    function create_if_block$5(ctx) {
    	let p;
    	let t_value = /*linea*/ ctx[6] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "text-slate-900 text-sm font-medium bg-yellow-300");
    			add_location(p, file$8, 24, 16, 724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pseudoCodigo*/ 1 && t_value !== (t_value = /*linea*/ ctx[6] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(24:12) {#if lineaActual === index}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#each pseudoCodigo as linea, index}
    function create_each_block$2(ctx) {
    	let div;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*lineaActual*/ ctx[1] === /*index*/ ctx[8]) return create_if_block$5;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t = space();
    			attr_dev(div, "class", "min-h-12 py-3 mx-4 flex items-center whitespace-pre-wrap");
    			add_location(div, file$8, 22, 8, 597);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(22:4) {#each pseudoCodigo as linea, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let each_value = /*pseudoCodigo*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "overflow-auto ");
    			add_location(div, file$8, 20, 0, 497);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			/*div_binding*/ ctx[3](div);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pseudoCodigo, lineaActual*/ 3) {
    				each_value = /*pseudoCodigo*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			/*div_binding*/ ctx[3](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pseudocodigo', slots, []);
    	let { pseudoCodigo } = $$props;
    	let { lineaActual } = $$props;
    	let prevLinea;
    	let divScroll;

    	function autoScroll() {
    		if (divScroll) {
    			//console.log("autoscroll");
    			//console.log(divScroll.scrollHeight);
    			$$invalidate(2, divScroll.scrollTop = divScroll.scrollHeight * (lineaActual / pseudoCodigo.length), divScroll);
    		}
    	}

    	afterUpdate(() => {
    		if (prevLinea !== lineaActual) {
    			prevLinea = lineaActual;
    			autoScroll();
    		}
    	});

    	const writable_props = ['pseudoCodigo', 'lineaActual'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pseudocodigo> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			divScroll = $$value;
    			$$invalidate(2, divScroll);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('pseudoCodigo' in $$props) $$invalidate(0, pseudoCodigo = $$props.pseudoCodigo);
    		if ('lineaActual' in $$props) $$invalidate(1, lineaActual = $$props.lineaActual);
    	};

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		pseudoCodigo,
    		lineaActual,
    		prevLinea,
    		divScroll,
    		autoScroll
    	});

    	$$self.$inject_state = $$props => {
    		if ('pseudoCodigo' in $$props) $$invalidate(0, pseudoCodigo = $$props.pseudoCodigo);
    		if ('lineaActual' in $$props) $$invalidate(1, lineaActual = $$props.lineaActual);
    		if ('prevLinea' in $$props) prevLinea = $$props.prevLinea;
    		if ('divScroll' in $$props) $$invalidate(2, divScroll = $$props.divScroll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pseudoCodigo, lineaActual, divScroll, div_binding];
    }

    class Pseudocodigo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { pseudoCodigo: 0, lineaActual: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pseudocodigo",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pseudoCodigo*/ ctx[0] === undefined && !('pseudoCodigo' in props)) {
    			console.warn("<Pseudocodigo> was created without expected prop 'pseudoCodigo'");
    		}

    		if (/*lineaActual*/ ctx[1] === undefined && !('lineaActual' in props)) {
    			console.warn("<Pseudocodigo> was created without expected prop 'lineaActual'");
    		}
    	}

    	get pseudoCodigo() {
    		throw new Error("<Pseudocodigo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pseudoCodigo(value) {
    		throw new Error("<Pseudocodigo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineaActual() {
    		throw new Error("<Pseudocodigo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineaActual(value) {
    		throw new Error("<Pseudocodigo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Consola/RedResidual.svelte generated by Svelte v3.48.0 */

    const file$7 = "src/components/Consola/RedResidual.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (39:16) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let p;
    	let t0_value = /*redResidual*/ ctx[0][/*i*/ ctx[6] - 1][/*j*/ ctx[8] - 1] + "";
    	let t0;
    	let t1;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(p, file$7, 40, 24, 1516);
    			attr_dev(div, "class", div_class_value = "p-2 rounded-lg shadow-lg text-slate-800 " + /*matrizColores*/ ctx[1][/*i*/ ctx[6] - 1][/*j*/ ctx[8] - 1]);
    			add_location(div, file$7, 39, 20, 1412);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*redResidual*/ 1 && t0_value !== (t0_value = /*redResidual*/ ctx[0][/*i*/ ctx[6] - 1][/*j*/ ctx[8] - 1] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*matrizColores*/ 2 && div_class_value !== (div_class_value = "p-2 rounded-lg shadow-lg text-slate-800 " + /*matrizColores*/ ctx[1][/*i*/ ctx[6] - 1][/*j*/ ctx[8] - 1])) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(39:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:34) 
    function create_if_block_2$2(ctx) {
    	let div;
    	let p;
    	let t0_value = /*i*/ ctx[6] - 1 + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(p, file$7, 34, 24, 1273);
    			attr_dev(div, "class", "p-2 rounded-lg shadow-lg bg-slate-800");
    			add_location(div, file$7, 33, 20, 1197);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(33:34) ",
    		ctx
    	});

    	return block;
    }

    // (27:34) 
    function create_if_block_1$4(ctx) {
    	let div;
    	let p;
    	let t0_value = /*j*/ ctx[8] - 1 + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(p, file$7, 28, 24, 1047);
    			attr_dev(div, "class", "p-2 rounded-lg shadow-lg bg-slate-800");
    			add_location(div, file$7, 27, 20, 971);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(27:34) ",
    		ctx
    	});

    	return block;
    }

    // (21:16) {#if i === 0 && j === 0}
    function create_if_block$4(ctx) {
    	let div;
    	let p;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Índice";
    			t1 = space();
    			add_location(p, file$7, 22, 24, 820);
    			attr_dev(div, "class", "p-2 rounded-lg shadow-lg bg-slate-800");
    			add_location(div, file$7, 21, 20, 744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(21:16) {#if i === 0 && j === 0}",
    		ctx
    	});

    	return block;
    }

    // (20:12) {#each Array(dimension + 1) as _, j}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[6] === 0 && /*j*/ ctx[8] === 0) return create_if_block$4;
    		if (/*i*/ ctx[6] === 0) return create_if_block_1$4;
    		if (/*j*/ ctx[8] === 0) return create_if_block_2$2;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(20:12) {#each Array(dimension + 1) as _, j}",
    		ctx
    	});

    	return block;
    }

    // (19:8) {#each Array(dimension + 1) as _, i}
    function create_each_block$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = Array(/*dimension*/ ctx[2] + 1);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*matrizColores, redResidual, dimension*/ 7) {
    				each_value_1 = Array(/*dimension*/ ctx[2] + 1);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(19:8) {#each Array(dimension + 1) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let each_value = Array(/*dimension*/ ctx[2] + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div0, "grid-template-columns", "repeat(" + (/*dimension*/ ctx[2] + 1) + ", minmax(0, 1fr))");
    			attr_dev(div0, "class", "grid gap-3");
    			add_location(div0, file$7, 17, 4, 492);
    			attr_dev(div1, "class", "overflow-auto text-white text-sm font-medium text-center p-4");
    			add_location(div1, file$7, 16, 0, 413);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Array, dimension, matrizColores, redResidual*/ 7) {
    				each_value = Array(/*dimension*/ ctx[2] + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*dimension*/ 4) {
    				set_style(div0, "grid-template-columns", "repeat(" + (/*dimension*/ ctx[2] + 1) + ", minmax(0, 1fr))");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let dimension;
    	let matrizColores;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RedResidual', slots, []);
    	let { matrizAdyacencia } = $$props;
    	let { redResidual } = $$props;
    	const writable_props = ['matrizAdyacencia', 'redResidual'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RedResidual> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('matrizAdyacencia' in $$props) $$invalidate(3, matrizAdyacencia = $$props.matrizAdyacencia);
    		if ('redResidual' in $$props) $$invalidate(0, redResidual = $$props.redResidual);
    	};

    	$$self.$capture_state = () => ({
    		matrizAdyacencia,
    		redResidual,
    		matrizColores,
    		dimension
    	});

    	$$self.$inject_state = $$props => {
    		if ('matrizAdyacencia' in $$props) $$invalidate(3, matrizAdyacencia = $$props.matrizAdyacencia);
    		if ('redResidual' in $$props) $$invalidate(0, redResidual = $$props.redResidual);
    		if ('matrizColores' in $$props) $$invalidate(1, matrizColores = $$props.matrizColores);
    		if ('dimension' in $$props) $$invalidate(2, dimension = $$props.dimension);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*redResidual*/ 1) {
    			$$invalidate(2, dimension = redResidual.length);
    		}

    		if ($$self.$$.dirty & /*matrizAdyacencia, redResidual*/ 9) {
    			$$invalidate(1, matrizColores = matrizAdyacencia.map((fila, i) => fila.map((_, j) => {
    				if (matrizAdyacencia[i][j] !== redResidual[i][j]) {
    					return "bg-rose-400";
    				} else if (redResidual[i][j] <= 0) {
    					return "bg-gray-200";
    				} else {
    					return "bg-emerald-400";
    				}
    			})));
    		}
    	};

    	return [redResidual, matrizColores, dimension, matrizAdyacencia];
    }

    class RedResidual extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { matrizAdyacencia: 3, redResidual: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RedResidual",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*matrizAdyacencia*/ ctx[3] === undefined && !('matrizAdyacencia' in props)) {
    			console.warn("<RedResidual> was created without expected prop 'matrizAdyacencia'");
    		}

    		if (/*redResidual*/ ctx[0] === undefined && !('redResidual' in props)) {
    			console.warn("<RedResidual> was created without expected prop 'redResidual'");
    		}
    	}

    	get matrizAdyacencia() {
    		throw new Error("<RedResidual>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set matrizAdyacencia(value) {
    		throw new Error("<RedResidual>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redResidual() {
    		throw new Error("<RedResidual>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set redResidual(value) {
    		throw new Error("<RedResidual>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Consola/Consola.svelte generated by Svelte v3.48.0 */
    const file$6 = "src/components/Consola/Consola.svelte";

    // (77:4) {:else}
    function create_else_block$2(ctx) {
    	let div1;
    	let button;
    	let div0;
    	let p;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "?";
    			attr_dev(p, "class", "text-2xl text-white");
    			add_location(p, file$6, 80, 20, 3485);
    			attr_dev(div0, "class", "w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center");
    			add_location(div0, file$6, 79, 16, 3381);
    			attr_dev(button, "class", "w-full h-full flex items-center justify-center");
    			add_location(button, file$6, 78, 12, 3277);
    			attr_dev(div1, "class", "bg-white rounded-full w-16 h-16 mr-4 mb-4");
    			add_location(div1, file$6, 77, 8, 3209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(button, div0);
    			append_dev(div0, p);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*onClickAbrir*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(77:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if consola.abierta }
    function create_if_block$3(ctx) {
    	let div0;
    	let button0;
    	let p0;
    	let t1;
    	let p1;
    	let t2_value = /*titulo*/ ctx[2]() + "";
    	let t2;
    	let t3;
    	let div3;
    	let div1;
    	let button1;
    	let t5;
    	let button2;
    	let t7;
    	let button3;
    	let t9;
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$3, create_if_block_2$1, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*categoria*/ ctx[1] === "EXPLICACION") return 0;
    		if (/*categoria*/ ctx[1] === "PSEUDOCODIGO") return 1;
    		if (/*categoria*/ ctx[1] === "RED_RESIDUAL") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button0 = element("button");
    			p0 = element("p");
    			p0.textContent = "X";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			div3 = element("div");
    			div1 = element("div");
    			button1 = element("button");
    			button1.textContent = "🤔";
    			t5 = space();
    			button2 = element("button");
    			button2.textContent = "🖥️";
    			t7 = space();
    			button3 = element("button");
    			button3.textContent = "🕸️";
    			t9 = space();
    			div2 = element("div");
    			if (if_block) if_block.c();
    			add_location(p0, file$6, 39, 20, 1228);
    			attr_dev(button0, "class", "text-base bg-rose-700 ml-0 h-full w-12");
    			add_location(button0, file$6, 38, 16, 1127);
    			attr_dev(p1, "class", "text-base m-auto");
    			add_location(p1, file$6, 41, 16, 1279);
    			attr_dev(div0, "class", "flex rounded-t-lg bg-indigo-700 overflow-hidden h-8");
    			add_location(div0, file$6, 37, 12, 1045);
    			attr_dev(button1, "class", "p-2 hover:bg-gray-700");
    			toggle_class(button1, "bg-violet-800", /*categoria*/ ctx[1] === "EXPLICACION");
    			add_location(button1, file$6, 48, 20, 1633);
    			attr_dev(button2, "class", "p-2 hover:bg-gray-700");
    			toggle_class(button2, "bg-violet-800", /*categoria*/ ctx[1] === "PSEUDOCODIGO");
    			add_location(button2, file$6, 51, 20, 1836);
    			attr_dev(button3, "class", "p-2 hover:bg-gray-700");
    			toggle_class(button3, "bg-violet-800", /*categoria*/ ctx[1] === "RED_RESIDUAL");
    			add_location(button3, file$6, 54, 20, 2041);
    			attr_dev(div1, "class", "flex flex-col h-auto py-2 space-y-4 w-12 bg-slate-900 text-xl text-center ");
    			add_location(div1, file$6, 46, 16, 1435);
    			attr_dev(div2, "class", "bg-white overflow-auto h-72 w-[32rem] shadow-lg ring-1 flex flex-col divide-y ");
    			add_location(div2, file$6, 58, 16, 2265);
    			attr_dev(div3, "class", "flex flex-row");
    			add_location(div3, file$6, 45, 12, 1391);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button0);
    			append_dev(button0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(p1, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, button1);
    			append_dev(div1, t5);
    			append_dev(div1, button2);
    			append_dev(div1, t7);
    			append_dev(div1, button3);
    			append_dev(div3, t9);
    			append_dev(div3, div2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div2, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*onClickCerrar*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*onClickButtonExplicacion*/ ctx[3], false, false, false),
    					listen_dev(button2, "click", /*onClickButtonPseudocodigo*/ ctx[4], false, false, false),
    					listen_dev(button3, "click", /*onClickButtonRedAumentada*/ ctx[5], false, false, false),
    					action_destroyer(twemoji_2.call(null, div1, { className: 'emoji' }))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*titulo*/ 4) && t2_value !== (t2_value = /*titulo*/ ctx[2]() + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*categoria*/ 2) {
    				toggle_class(button1, "bg-violet-800", /*categoria*/ ctx[1] === "EXPLICACION");
    			}

    			if (dirty & /*categoria*/ 2) {
    				toggle_class(button2, "bg-violet-800", /*categoria*/ ctx[1] === "PSEUDOCODIGO");
    			}

    			if (dirty & /*categoria*/ 2) {
    				toggle_class(button3, "bg-violet-800", /*categoria*/ ctx[1] === "RED_RESIDUAL");
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(37:4) {#if consola.abierta }",
    		ctx
    	});

    	return block;
    }

    // (69:59) 
    function create_if_block_3(ctx) {
    	let redresidual;
    	let current;

    	redresidual = new RedResidual({
    			props: {
    				matrizAdyacencia: /*consola*/ ctx[0].grafo.matrizAdyacencia,
    				redResidual: /*consola*/ ctx[0].grafo.redResidual
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(redresidual.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(redresidual, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const redresidual_changes = {};
    			if (dirty & /*consola*/ 1) redresidual_changes.matrizAdyacencia = /*consola*/ ctx[0].grafo.matrizAdyacencia;
    			if (dirty & /*consola*/ 1) redresidual_changes.redResidual = /*consola*/ ctx[0].grafo.redResidual;
    			redresidual.$set(redresidual_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(redresidual.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(redresidual.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(redresidual, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(69:59) ",
    		ctx
    	});

    	return block;
    }

    // (64:59) 
    function create_if_block_2$1(ctx) {
    	let pseudocodigo;
    	let current;

    	pseudocodigo = new Pseudocodigo({
    			props: {
    				pseudoCodigo: /*consola*/ ctx[0].pseudoCodigo,
    				lineaActual: /*consola*/ ctx[0].ubicacionPseudoCodigo
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pseudocodigo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pseudocodigo, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pseudocodigo_changes = {};
    			if (dirty & /*consola*/ 1) pseudocodigo_changes.pseudoCodigo = /*consola*/ ctx[0].pseudoCodigo;
    			if (dirty & /*consola*/ 1) pseudocodigo_changes.lineaActual = /*consola*/ ctx[0].ubicacionPseudoCodigo;
    			pseudocodigo.$set(pseudocodigo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pseudocodigo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pseudocodigo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pseudocodigo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(64:59) ",
    		ctx
    	});

    	return block;
    }

    // (60:20) {#if categoria === "EXPLICACION"}
    function create_if_block_1$3(ctx) {
    	let explicacion;
    	let current;

    	explicacion = new Explicacion({
    			props: {
    				textoExplicativo: /*consola*/ ctx[0].textoExplicativo
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(explicacion.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(explicacion, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const explicacion_changes = {};
    			if (dirty & /*consola*/ 1) explicacion_changes.textoExplicativo = /*consola*/ ctx[0].textoExplicativo;
    			explicacion.$set(explicacion_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(explicacion.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(explicacion.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(explicacion, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(60:20) {#if categoria === \\\"EXPLICACION\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*consola*/ ctx[0].abierta) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "absolute bottom-0 right-0 pointer-events-auto");
    			add_location(div, file$6, 35, 0, 946);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let categoria;
    	let titulo;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Consola', slots, []);
    	let { consola } = $$props;

    	function onClickButtonExplicacion() {
    		consola.cambiarCategoria("EXPLICACION");
    	}

    	function onClickButtonPseudocodigo() {
    		consola.cambiarCategoria("PSEUDOCODIGO");
    	}

    	function onClickButtonRedAumentada() {
    		consola.cambiarCategoria("RED_RESIDUAL");
    	}

    	function onClickAbrir() {
    		consola.abrir();
    	}

    	function onClickCerrar() {
    		consola.cerrar();
    	}

    	const writable_props = ['consola'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Consola> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('consola' in $$props) $$invalidate(0, consola = $$props.consola);
    	};

    	$$self.$capture_state = () => ({
    		twemoji: twemoji_2,
    		Explicacion,
    		Pseudocodigo,
    		RedResidual,
    		consola,
    		onClickButtonExplicacion,
    		onClickButtonPseudocodigo,
    		onClickButtonRedAumentada,
    		onClickAbrir,
    		onClickCerrar,
    		categoria,
    		titulo
    	});

    	$$self.$inject_state = $$props => {
    		if ('consola' in $$props) $$invalidate(0, consola = $$props.consola);
    		if ('categoria' in $$props) $$invalidate(1, categoria = $$props.categoria);
    		if ('titulo' in $$props) $$invalidate(2, titulo = $$props.titulo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*consola*/ 1) {
    			$$invalidate(1, categoria = consola.categoria);
    		}

    		if ($$self.$$.dirty & /*categoria*/ 2) {
    			$$invalidate(2, titulo = () => {
    				switch (categoria) {
    					case "EXPLICACION":
    						return "Explicación";
    					case "PSEUDOCODIGO":
    						return "Pseudocódigo";
    					case "RED_RESIDUAL":
    						return "Red Residual";
    					default:
    						return "Informacion del algoritmo";
    				}
    			});
    		}
    	};

    	return [
    		consola,
    		categoria,
    		titulo,
    		onClickButtonExplicacion,
    		onClickButtonPseudocodigo,
    		onClickButtonRedAumentada,
    		onClickAbrir,
    		onClickCerrar
    	];
    }

    class Consola extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { consola: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Consola",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*consola*/ ctx[0] === undefined && !('consola' in props)) {
    			console.warn("<Consola> was created without expected prop 'consola'");
    		}
    	}

    	get consola() {
    		throw new Error("<Consola>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set consola(value) {
    		throw new Error("<Consola>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Grafo/Vertice/Vertice.svelte generated by Svelte v3.48.0 */

    const file$5 = "src/components/Grafo/Vertice/Vertice.svelte";

    function create_fragment$5(ctx) {
    	let foreignObject;
    	let div2;
    	let div0;
    	let p;
    	let t0;
    	let div0_class_value;
    	let t1;
    	let div1;
    	let button0;
    	let t2;
    	let button0_style_value;
    	let t3;
    	let button1;
    	let t4;
    	let button1_style_value;
    	let div1_style_value;
    	let foreignObject_x_value;
    	let foreignObject_y_value;
    	let foreignObject_width_value;
    	let foreignObject_height_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			foreignObject = svg_element("foreignObject");
    			div2 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(/*nombre*/ ctx[3]);
    			t1 = space();
    			div1 = element("div");
    			button0 = element("button");
    			t2 = text("🔼");
    			t3 = space();
    			button1 = element("button");
    			t4 = text("🔽");
    			attr_dev(p, "class", "text-white text-center m-auto select-none");
    			add_location(p, file$5, 73, 12, 2185);
    			set_style(div0, "width", /*vertice*/ ctx[0].radio * 2 + "px ");
    			set_style(div0, "height", /*vertice*/ ctx[0].radio * 2 + "px ");
    			attr_dev(div0, "class", div0_class_value = "cursor-pointer flex " + /*color*/ ctx[1] + " rounded-full border border-white/20 overflow:hidden");
    			add_location(div0, file$5, 72, 8, 1986);
    			attr_dev(button0, "style", button0_style_value = /*vertice*/ ctx[0].fuente ? "" : "filter:grayscale(1);");
    			attr_dev(button0, "title", "Convertir en fuente");
    			add_location(button0, file$5, 78, 12, 2447);

    			attr_dev(button1, "style", button1_style_value = /*vertice*/ ctx[0].sumidero
    			? ""
    			: "filter:grayscale(1);");

    			attr_dev(button1, "title", "Convertir en sumidero");
    			add_location(button1, file$5, 81, 12, 2630);

    			attr_dev(div1, "style", div1_style_value = "width: " + /*vertice*/ ctx[0].radio + "px ;height: " + /*vertice*/ ctx[0].radio + "px ; " + (/*mostrarMenu*/ ctx[2]
    			? "display:block"
    			: "display:none"));

    			attr_dev(div1, "class", "text-lg");
    			add_location(div1, file$5, 77, 8, 2304);
    			attr_dev(div2, "class", "flex h-full w-full");
    			add_location(div2, file$5, 71, 4, 1945);
    			attr_dev(foreignObject, "x", foreignObject_x_value = /*vertice*/ ctx[0].posicion.x - /*vertice*/ ctx[0].radio);
    			attr_dev(foreignObject, "y", foreignObject_y_value = /*vertice*/ ctx[0].posicion.y - /*vertice*/ ctx[0].radio);
    			attr_dev(foreignObject, "width", foreignObject_width_value = /*vertice*/ ctx[0].radio * 3);
    			attr_dev(foreignObject, "height", foreignObject_height_value = /*vertice*/ ctx[0].radio * 3);
    			add_location(foreignObject, file$5, 70, 0, 1736);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, foreignObject, anchor);
    			append_dev(foreignObject, div2);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, button0);
    			append_dev(button0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, button1);
    			append_dev(button1, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousemove", /*onMouseMove*/ ctx[6], false, false, false),
    					listen_dev(window, "mouseup", /*onMouseUp*/ ctx[5], false, false, false),
    					listen_dev(div0, "mousedown", /*onMouseDown*/ ctx[4], false, false, false),
    					listen_dev(button0, "click", /*click_handler*/ ctx[14], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[15], false, false, false),
    					listen_dev(foreignObject, "mouseenter", /*onMouseEnter*/ ctx[7], false, false, false),
    					listen_dev(foreignObject, "mouseleave", /*onMouseLeave*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*nombre*/ 8) set_data_dev(t0, /*nombre*/ ctx[3]);

    			if (dirty & /*vertice*/ 1) {
    				set_style(div0, "width", /*vertice*/ ctx[0].radio * 2 + "px ");
    			}

    			if (dirty & /*vertice*/ 1) {
    				set_style(div0, "height", /*vertice*/ ctx[0].radio * 2 + "px ");
    			}

    			if (dirty & /*color*/ 2 && div0_class_value !== (div0_class_value = "cursor-pointer flex " + /*color*/ ctx[1] + " rounded-full border border-white/20 overflow:hidden")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*vertice*/ 1 && button0_style_value !== (button0_style_value = /*vertice*/ ctx[0].fuente ? "" : "filter:grayscale(1);")) {
    				attr_dev(button0, "style", button0_style_value);
    			}

    			if (dirty & /*vertice*/ 1 && button1_style_value !== (button1_style_value = /*vertice*/ ctx[0].sumidero
    			? ""
    			: "filter:grayscale(1);")) {
    				attr_dev(button1, "style", button1_style_value);
    			}

    			if (dirty & /*vertice, mostrarMenu*/ 5 && div1_style_value !== (div1_style_value = "width: " + /*vertice*/ ctx[0].radio + "px ;height: " + /*vertice*/ ctx[0].radio + "px ; " + (/*mostrarMenu*/ ctx[2]
    			? "display:block"
    			: "display:none"))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (dirty & /*vertice*/ 1 && foreignObject_x_value !== (foreignObject_x_value = /*vertice*/ ctx[0].posicion.x - /*vertice*/ ctx[0].radio)) {
    				attr_dev(foreignObject, "x", foreignObject_x_value);
    			}

    			if (dirty & /*vertice*/ 1 && foreignObject_y_value !== (foreignObject_y_value = /*vertice*/ ctx[0].posicion.y - /*vertice*/ ctx[0].radio)) {
    				attr_dev(foreignObject, "y", foreignObject_y_value);
    			}

    			if (dirty & /*vertice*/ 1 && foreignObject_width_value !== (foreignObject_width_value = /*vertice*/ ctx[0].radio * 3)) {
    				attr_dev(foreignObject, "width", foreignObject_width_value);
    			}

    			if (dirty & /*vertice*/ 1 && foreignObject_height_value !== (foreignObject_height_value = /*vertice*/ ctx[0].radio * 3)) {
    				attr_dev(foreignObject, "height", foreignObject_height_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(foreignObject);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let nombre;
    	let grafo;
    	let creandoArista;
    	let eliminandoVertice;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Vertice', slots, []);
    	let { vertice } = $$props;
    	let color = 'bg-purple-800';
    	let moviendo = false;
    	let mostrarMenu = false;

    	function onMouseDown() {
    		if (eliminandoVertice) {
    			vertice.eliminar();
    			grafo.finalizarEliminacionVertice();
    		} else if (creandoArista) {
    			if (grafo.nuevaAristaVerticeOrigen == null) {
    				grafo.seleccionarVerticeNuevaArista(vertice);
    			} else {
    				grafo.crearNuevaArista(grafo.nuevaAristaVerticeOrigen, vertice, 1); //TODO: PERMITIR QUE EL USUARIO INGRESE EL PESO
    			}
    		} else {
    			moviendo = true;
    		}
    	}

    	function onMouseUp() {
    		moviendo = false;
    	}

    	function onMouseMove(e) {
    		if (moviendo) {
    			const posX = vertice.posicion.x + e.movementX;
    			const posY = vertice.posicion.y + e.movementY;
    			vertice.mover({ x: posX, y: posY });
    			$$invalidate(0, vertice);
    		}
    	}

    	function onMouseEnter() {
    		$$invalidate(2, mostrarMenu = true);
    	}

    	function onMouseLeave() {
    		$$invalidate(2, mostrarMenu = false);
    	}

    	function toggleFuente() {
    		vertice.toggleFuente();
    		$$invalidate(0, vertice);
    	}

    	function toggleSumidero() {
    		vertice.toggleSumidero();
    		$$invalidate(0, vertice);
    	}

    	const writable_props = ['vertice'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Vertice> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		toggleFuente();
    	};

    	const click_handler_1 = () => {
    		toggleSumidero();
    	};

    	$$self.$$set = $$props => {
    		if ('vertice' in $$props) $$invalidate(0, vertice = $$props.vertice);
    	};

    	$$self.$capture_state = () => ({
    		vertice,
    		color,
    		moviendo,
    		mostrarMenu,
    		onMouseDown,
    		onMouseUp,
    		onMouseMove,
    		onMouseEnter,
    		onMouseLeave,
    		toggleFuente,
    		toggleSumidero,
    		grafo,
    		creandoArista,
    		eliminandoVertice,
    		nombre
    	});

    	$$self.$inject_state = $$props => {
    		if ('vertice' in $$props) $$invalidate(0, vertice = $$props.vertice);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('moviendo' in $$props) moviendo = $$props.moviendo;
    		if ('mostrarMenu' in $$props) $$invalidate(2, mostrarMenu = $$props.mostrarMenu);
    		if ('grafo' in $$props) $$invalidate(11, grafo = $$props.grafo);
    		if ('creandoArista' in $$props) $$invalidate(12, creandoArista = $$props.creandoArista);
    		if ('eliminandoVertice' in $$props) $$invalidate(13, eliminandoVertice = $$props.eliminandoVertice);
    		if ('nombre' in $$props) $$invalidate(3, nombre = $$props.nombre);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*vertice*/ 1) {
    			$$invalidate(3, nombre = vertice.nombre ? vertice.nombre : `Vert. ${vertice.id}`);
    		}

    		if ($$self.$$.dirty & /*vertice*/ 1) {
    			$$invalidate(11, grafo = vertice.grafo);
    		}

    		if ($$self.$$.dirty & /*grafo*/ 2048) {
    			$$invalidate(12, creandoArista = grafo.creandoArista);
    		}

    		if ($$self.$$.dirty & /*grafo*/ 2048) {
    			$$invalidate(13, eliminandoVertice = grafo.eliminandoVertice);
    		}

    		if ($$self.$$.dirty & /*vertice, eliminandoVertice, creandoArista, color*/ 12291) {
    			{
    				let colorNuevo = 'bg-purple-800';

    				if (vertice.fuente) {
    					colorNuevo = 'bg-green-700';
    				}

    				if (vertice.sumidero) {
    					colorNuevo = 'bg-red-800';
    				}

    				if (eliminandoVertice) {
    					colorNuevo = 'bg-gray-700';
    				}

    				if (creandoArista) {
    					colorNuevo = 'bg-yellow-700';
    				}

    				if (colorNuevo != color) {
    					$$invalidate(1, color = colorNuevo);
    				}
    			}
    		}
    	};

    	return [
    		vertice,
    		color,
    		mostrarMenu,
    		nombre,
    		onMouseDown,
    		onMouseUp,
    		onMouseMove,
    		onMouseEnter,
    		onMouseLeave,
    		toggleFuente,
    		toggleSumidero,
    		grafo,
    		creandoArista,
    		eliminandoVertice,
    		click_handler,
    		click_handler_1
    	];
    }

    class Vertice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { vertice: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Vertice",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*vertice*/ ctx[0] === undefined && !('vertice' in props)) {
    			console.warn("<Vertice> was created without expected prop 'vertice'");
    		}
    	}

    	get vertice() {
    		throw new Error("<Vertice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertice(value) {
    		throw new Error("<Vertice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Grafo/Arista/Flecha.svelte generated by Svelte v3.48.0 */

    const file$4 = "src/components/Grafo/Arista/Flecha.svelte";

    function create_fragment$4(ctx) {
    	let polygon;
    	let polygon_class_value;
    	let polygon_transform_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			polygon = svg_element("polygon");
    			attr_dev(polygon, "class", polygon_class_value = `${/*fillColor*/ ctx[1]}`);
    			attr_dev(polygon, "points", "-15,25 0,0 15,25, 0,15");
    			attr_dev(polygon, "transform", polygon_transform_value = `translate( ${/*posicion*/ ctx[0].x}, ${/*posicion*/ ctx[0].y} ) rotate(${/*angulodeg*/ ctx[2]})`);
    			add_location(polygon, file$4, 10, 0, 200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, polygon, anchor);

    			if (!mounted) {
    				dispose = listen_dev(polygon, "click", /*onClick*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fillColor*/ 2 && polygon_class_value !== (polygon_class_value = `${/*fillColor*/ ctx[1]}`)) {
    				attr_dev(polygon, "class", polygon_class_value);
    			}

    			if (dirty & /*posicion, angulodeg*/ 5 && polygon_transform_value !== (polygon_transform_value = `translate( ${/*posicion*/ ctx[0].x}, ${/*posicion*/ ctx[0].y} ) rotate(${/*angulodeg*/ ctx[2]})`)) {
    				attr_dev(polygon, "transform", polygon_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(polygon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let angulodeg;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Flecha', slots, []);
    	let { posicion } = $$props;
    	let { angulo } = $$props;
    	let { fillColor } = $$props;
    	let { onClickArista } = $$props;

    	function onClick() {
    		onClickArista();
    	}

    	const writable_props = ['posicion', 'angulo', 'fillColor', 'onClickArista'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Flecha> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('posicion' in $$props) $$invalidate(0, posicion = $$props.posicion);
    		if ('angulo' in $$props) $$invalidate(4, angulo = $$props.angulo);
    		if ('fillColor' in $$props) $$invalidate(1, fillColor = $$props.fillColor);
    		if ('onClickArista' in $$props) $$invalidate(5, onClickArista = $$props.onClickArista);
    	};

    	$$self.$capture_state = () => ({
    		posicion,
    		angulo,
    		fillColor,
    		onClickArista,
    		onClick,
    		angulodeg
    	});

    	$$self.$inject_state = $$props => {
    		if ('posicion' in $$props) $$invalidate(0, posicion = $$props.posicion);
    		if ('angulo' in $$props) $$invalidate(4, angulo = $$props.angulo);
    		if ('fillColor' in $$props) $$invalidate(1, fillColor = $$props.fillColor);
    		if ('onClickArista' in $$props) $$invalidate(5, onClickArista = $$props.onClickArista);
    		if ('angulodeg' in $$props) $$invalidate(2, angulodeg = $$props.angulodeg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*angulo*/ 16) {
    			$$invalidate(2, angulodeg = angulo * 180 / Math.PI);
    		}
    	};

    	return [posicion, fillColor, angulodeg, onClick, angulo, onClickArista];
    }

    class Flecha extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			posicion: 0,
    			angulo: 4,
    			fillColor: 1,
    			onClickArista: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Flecha",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*posicion*/ ctx[0] === undefined && !('posicion' in props)) {
    			console.warn("<Flecha> was created without expected prop 'posicion'");
    		}

    		if (/*angulo*/ ctx[4] === undefined && !('angulo' in props)) {
    			console.warn("<Flecha> was created without expected prop 'angulo'");
    		}

    		if (/*fillColor*/ ctx[1] === undefined && !('fillColor' in props)) {
    			console.warn("<Flecha> was created without expected prop 'fillColor'");
    		}

    		if (/*onClickArista*/ ctx[5] === undefined && !('onClickArista' in props)) {
    			console.warn("<Flecha> was created without expected prop 'onClickArista'");
    		}
    	}

    	get posicion() {
    		throw new Error("<Flecha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set posicion(value) {
    		throw new Error("<Flecha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get angulo() {
    		throw new Error("<Flecha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set angulo(value) {
    		throw new Error("<Flecha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fillColor() {
    		throw new Error("<Flecha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillColor(value) {
    		throw new Error("<Flecha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClickArista() {
    		throw new Error("<Flecha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClickArista(value) {
    		throw new Error("<Flecha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Grafo/Arista/Peso.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/components/Grafo/Arista/Peso.svelte";

    // (29:0) {#if (peso == "∞" || (!isNaN(Number(peso)) && peso > 0 )) && (dibujarCero || Number(peso) !== 0 ) }
    function create_if_block$2(ctx) {
    	let foreignObject;
    	let div;
    	let div_class_value;
    	let foreignObject_x_value;
    	let foreignObject_y_value;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*cambiarPeso*/ ctx[3]) return create_if_block_1$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			foreignObject = svg_element("foreignObject");
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", div_class_value = "flex w-full h-full " + /*textColor*/ ctx[4] + " text-center " + /*bgColor*/ ctx[2] + " rounded-full border border-white/20");
    			add_location(div, file$3, 30, 8, 959);
    			attr_dev(foreignObject, "x", foreignObject_x_value = /*posicion*/ ctx[1].x - radiopeso);
    			attr_dev(foreignObject, "y", foreignObject_y_value = /*posicion*/ ctx[1].y - radiopeso);
    			attr_dev(foreignObject, "width", radiopeso * 2);
    			attr_dev(foreignObject, "height", radiopeso * 2);
    			add_location(foreignObject, file$3, 29, 4, 817);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, foreignObject, anchor);
    			append_dev(foreignObject, div);
    			if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(foreignObject, "click", /*onClick*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}

    			if (dirty & /*textColor, bgColor*/ 20 && div_class_value !== (div_class_value = "flex w-full h-full " + /*textColor*/ ctx[4] + " text-center " + /*bgColor*/ ctx[2] + " rounded-full border border-white/20")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*posicion*/ 2 && foreignObject_x_value !== (foreignObject_x_value = /*posicion*/ ctx[1].x - radiopeso)) {
    				attr_dev(foreignObject, "x", foreignObject_x_value);
    			}

    			if (dirty & /*posicion*/ 2 && foreignObject_y_value !== (foreignObject_y_value = /*posicion*/ ctx[1].y - radiopeso)) {
    				attr_dev(foreignObject, "y", foreignObject_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(foreignObject);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(29:0) {#if (peso == \\\"∞\\\" || (!isNaN(Number(peso)) && peso > 0 )) && (dibujarCero || Number(peso) !== 0 ) }",
    		ctx
    	});

    	return block;
    }

    // (35:12) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*peso*/ ctx[0]);
    			attr_dev(div, "class", "m-auto text-center ");
    			add_location(div, file$3, 35, 16, 1306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*peso*/ 1) set_data_dev(t, /*peso*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(35:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:12) {#if cambiarPeso}
    function create_if_block_1$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "w-full h-full text-center bg-transparent appearance-none border-none outline-none  svelte-2cx1yt");
    			input.value = /*peso*/ ctx[0];
    			add_location(input, file$3, 33, 16, 1121);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*cambioPeso*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*peso*/ 1 && input.value !== /*peso*/ ctx[0]) {
    				prop_dev(input, "value", /*peso*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(33:12) {#if cambiarPeso}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let show_if = (/*peso*/ ctx[0] == "∞" || !isNaN(Number(/*peso*/ ctx[0])) && /*peso*/ ctx[0] > 0) && (/*dibujarCero*/ ctx[5] || Number(/*peso*/ ctx[0]) !== 0);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*peso, dibujarCero*/ 33) show_if = (/*peso*/ ctx[0] == "∞" || !isNaN(Number(/*peso*/ ctx[0])) && /*peso*/ ctx[0] > 0) && (/*dibujarCero*/ ctx[5] || Number(/*peso*/ ctx[0]) !== 0);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const radiopeso = 20;

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Peso', slots, []);
    	let { onClickArista } = $$props;
    	let { posicion } = $$props;
    	let { peso } = $$props;
    	let { bgColor } = $$props;
    	let { cambiarPeso = null } = $$props;
    	let { textColor = "text-white" } = $$props;
    	let { dibujarCero = true } = $$props;

    	function cambioPeso() {
    		const pesoActual = peso;
    		const pesoNuevo = parseInt(this.value);

    		//si el peso nuevo no es un numero no se cambia
    		if (isNaN(pesoNuevo) || pesoNuevo < 0) {
    			console.log("Nuevo peso no es un numero valido");
    			alert("Nuevo peso no es un numero valido");
    			this.value = pesoActual;
    			return;
    		}

    		cambiarPeso(pesoNuevo);
    	}

    	function onClick() {
    		onClickArista();
    	}

    	const writable_props = [
    		'onClickArista',
    		'posicion',
    		'peso',
    		'bgColor',
    		'cambiarPeso',
    		'textColor',
    		'dibujarCero'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Peso> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onClickArista' in $$props) $$invalidate(8, onClickArista = $$props.onClickArista);
    		if ('posicion' in $$props) $$invalidate(1, posicion = $$props.posicion);
    		if ('peso' in $$props) $$invalidate(0, peso = $$props.peso);
    		if ('bgColor' in $$props) $$invalidate(2, bgColor = $$props.bgColor);
    		if ('cambiarPeso' in $$props) $$invalidate(3, cambiarPeso = $$props.cambiarPeso);
    		if ('textColor' in $$props) $$invalidate(4, textColor = $$props.textColor);
    		if ('dibujarCero' in $$props) $$invalidate(5, dibujarCero = $$props.dibujarCero);
    	};

    	$$self.$capture_state = () => ({
    		onClickArista,
    		posicion,
    		peso,
    		bgColor,
    		cambiarPeso,
    		textColor,
    		dibujarCero,
    		radiopeso,
    		cambioPeso,
    		onClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('onClickArista' in $$props) $$invalidate(8, onClickArista = $$props.onClickArista);
    		if ('posicion' in $$props) $$invalidate(1, posicion = $$props.posicion);
    		if ('peso' in $$props) $$invalidate(0, peso = $$props.peso);
    		if ('bgColor' in $$props) $$invalidate(2, bgColor = $$props.bgColor);
    		if ('cambiarPeso' in $$props) $$invalidate(3, cambiarPeso = $$props.cambiarPeso);
    		if ('textColor' in $$props) $$invalidate(4, textColor = $$props.textColor);
    		if ('dibujarCero' in $$props) $$invalidate(5, dibujarCero = $$props.dibujarCero);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*peso*/ 1) {
    			if (peso === Infinity) {
    				$$invalidate(0, peso = "∞");
    			}
    		}
    	};

    	return [
    		peso,
    		posicion,
    		bgColor,
    		cambiarPeso,
    		textColor,
    		dibujarCero,
    		cambioPeso,
    		onClick,
    		onClickArista
    	];
    }

    class Peso extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			onClickArista: 8,
    			posicion: 1,
    			peso: 0,
    			bgColor: 2,
    			cambiarPeso: 3,
    			textColor: 4,
    			dibujarCero: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Peso",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClickArista*/ ctx[8] === undefined && !('onClickArista' in props)) {
    			console_1$1.warn("<Peso> was created without expected prop 'onClickArista'");
    		}

    		if (/*posicion*/ ctx[1] === undefined && !('posicion' in props)) {
    			console_1$1.warn("<Peso> was created without expected prop 'posicion'");
    		}

    		if (/*peso*/ ctx[0] === undefined && !('peso' in props)) {
    			console_1$1.warn("<Peso> was created without expected prop 'peso'");
    		}

    		if (/*bgColor*/ ctx[2] === undefined && !('bgColor' in props)) {
    			console_1$1.warn("<Peso> was created without expected prop 'bgColor'");
    		}
    	}

    	get onClickArista() {
    		throw new Error("<Peso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClickArista(value) {
    		throw new Error("<Peso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get posicion() {
    		throw new Error("<Peso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set posicion(value) {
    		throw new Error("<Peso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get peso() {
    		throw new Error("<Peso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set peso(value) {
    		throw new Error("<Peso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgColor() {
    		throw new Error("<Peso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgColor(value) {
    		throw new Error("<Peso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cambiarPeso() {
    		throw new Error("<Peso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cambiarPeso(value) {
    		throw new Error("<Peso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textColor() {
    		throw new Error("<Peso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textColor(value) {
    		throw new Error("<Peso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dibujarCero() {
    		throw new Error("<Peso>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dibujarCero(value) {
    		throw new Error("<Peso>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Grafo/Arista/Arista.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/components/Grafo/Arista/Arista.svelte";

    // (277:4) {:else}
    function create_else_block(ctx) {
    	let line;
    	let line_class_value;
    	let line_x__value;
    	let line_y__value;
    	let line_x__value_1;
    	let line_y__value_1;
    	let flecha;
    	let peso;
    	let current;
    	let mounted;
    	let dispose;

    	flecha = new Flecha({
    			props: {
    				onClickArista: /*onClickArista*/ ctx[8],
    				posicion: /*posicionesArista*/ ctx[3].final,
    				angulo: /*posicionesArista*/ ctx[3].angulo + Math.PI / 2,
    				fillColor: /*arista*/ ctx[1] === /*aristaPrincipal*/ ctx[2]
    				? /*colores*/ ctx[6].coloresFill.color
    				: /*colores*/ ctx[6].coloresFill.colorInverso
    			},
    			$$inline: true
    		});

    	peso = new Peso({
    			props: {
    				onClickArista: /*onClickArista*/ ctx[8],
    				posicion: /*posicionesPesos*/ ctx[4].posicionPeso,
    				peso: /*aristaPrincipal*/ ctx[2].peso,
    				bgColor: /*arista*/ ctx[1] === /*aristaPrincipal*/ ctx[2]
    				? /*colores*/ ctx[6].coloresBG.color
    				: /*colores*/ ctx[6].coloresBG.colorInverso,
    				cambiarPeso: /*aristaPrincipal*/ ctx[2].cambiarPeso.bind(/*aristaPrincipal*/ ctx[2])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			create_component(flecha.$$.fragment);
    			create_component(peso.$$.fragment);

    			attr_dev(line, "class", line_class_value = "" + ((/*arista*/ ctx[1] === /*aristaPrincipal*/ ctx[2]
    			? /*colores*/ ctx[6].coloresStroke.color
    			: /*colores*/ ctx[6].coloresStroke.colorInverso) + " stroke-2"));

    			attr_dev(line, "x1", line_x__value = /*posicionesArista*/ ctx[3].inicio.x);
    			attr_dev(line, "y1", line_y__value = /*posicionesArista*/ ctx[3].inicio.y);
    			attr_dev(line, "x2", line_x__value_1 = /*posicionesArista*/ ctx[3].final.x);
    			attr_dev(line, "y2", line_y__value_1 = /*posicionesArista*/ ctx[3].final.y);
    			add_location(line, file$2, 277, 8, 10466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    			mount_component(flecha, target, anchor);
    			mount_component(peso, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(line, "click", /*onClickArista*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*arista, aristaPrincipal, colores*/ 70 && line_class_value !== (line_class_value = "" + ((/*arista*/ ctx[1] === /*aristaPrincipal*/ ctx[2]
    			? /*colores*/ ctx[6].coloresStroke.color
    			: /*colores*/ ctx[6].coloresStroke.colorInverso) + " stroke-2"))) {
    				attr_dev(line, "class", line_class_value);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line_x__value !== (line_x__value = /*posicionesArista*/ ctx[3].inicio.x)) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line_y__value !== (line_y__value = /*posicionesArista*/ ctx[3].inicio.y)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line_x__value_1 !== (line_x__value_1 = /*posicionesArista*/ ctx[3].final.x)) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line_y__value_1 !== (line_y__value_1 = /*posicionesArista*/ ctx[3].final.y)) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			const flecha_changes = {};
    			if (dirty & /*posicionesArista*/ 8) flecha_changes.posicion = /*posicionesArista*/ ctx[3].final;
    			if (dirty & /*posicionesArista*/ 8) flecha_changes.angulo = /*posicionesArista*/ ctx[3].angulo + Math.PI / 2;

    			if (dirty & /*arista, aristaPrincipal, colores*/ 70) flecha_changes.fillColor = /*arista*/ ctx[1] === /*aristaPrincipal*/ ctx[2]
    			? /*colores*/ ctx[6].coloresFill.color
    			: /*colores*/ ctx[6].coloresFill.colorInverso;

    			flecha.$set(flecha_changes);
    			const peso_changes = {};
    			if (dirty & /*posicionesPesos*/ 16) peso_changes.posicion = /*posicionesPesos*/ ctx[4].posicionPeso;
    			if (dirty & /*aristaPrincipal*/ 4) peso_changes.peso = /*aristaPrincipal*/ ctx[2].peso;

    			if (dirty & /*arista, aristaPrincipal, colores*/ 70) peso_changes.bgColor = /*arista*/ ctx[1] === /*aristaPrincipal*/ ctx[2]
    			? /*colores*/ ctx[6].coloresBG.color
    			: /*colores*/ ctx[6].coloresBG.colorInverso;

    			if (dirty & /*aristaPrincipal*/ 4) peso_changes.cambiarPeso = /*aristaPrincipal*/ ctx[2].cambiarPeso.bind(/*aristaPrincipal*/ ctx[2]);
    			peso.$set(peso_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flecha.$$.fragment, local);
    			transition_in(peso.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flecha.$$.fragment, local);
    			transition_out(peso.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    			destroy_component(flecha, detaching);
    			destroy_component(peso, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(277:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (229:4) {#if aristaBidireccional}
    function create_if_block_2(ctx) {
    	let line0;
    	let line0_class_value;
    	let line0_x__value;
    	let line0_y__value;
    	let line0_x__value_1;
    	let line0_y__value_1;
    	let line1;
    	let line1_class_value;
    	let line1_x__value;
    	let line1_y__value;
    	let line1_x__value_1;
    	let line1_y__value_1;
    	let flecha0;
    	let flecha1;
    	let peso0;
    	let peso1;
    	let current;
    	let mounted;
    	let dispose;

    	flecha0 = new Flecha({
    			props: {
    				onClickArista: /*onClickArista*/ ctx[8],
    				posicion: /*posicionesArista*/ ctx[3].inicio,
    				angulo: /*posicionesArista*/ ctx[3].angulo - Math.PI / 2,
    				fillColor: /*colores*/ ctx[6].coloresFill.colorInverso
    			},
    			$$inline: true
    		});

    	flecha1 = new Flecha({
    			props: {
    				onClickArista: /*onClickArista*/ ctx[8],
    				posicion: /*posicionesArista*/ ctx[3].final,
    				angulo: /*posicionesArista*/ ctx[3].angulo + Math.PI / 2,
    				fillColor: /*colores*/ ctx[6].coloresFill.color
    			},
    			$$inline: true
    		});

    	peso0 = new Peso({
    			props: {
    				onClickArista: /*onClickArista*/ ctx[8],
    				posicion: /*posicionesPesos*/ ctx[4].posicionPeso,
    				peso: /*arista*/ ctx[1].peso,
    				bgColor: /*colores*/ ctx[6].coloresBG.color,
    				cambiarPeso: /*arista*/ ctx[1].cambiarPeso.bind(/*arista*/ ctx[1])
    			},
    			$$inline: true
    		});

    	peso1 = new Peso({
    			props: {
    				onClickArista: /*onClickArista*/ ctx[8],
    				posicion: /*posicionesPesos*/ ctx[4].posicionPesoInverso,
    				peso: /*aristaInversa*/ ctx[0].peso,
    				bgColor: /*colores*/ ctx[6].coloresBG.colorInverso,
    				cambiarPeso: /*aristaInversa*/ ctx[0].cambiarPeso.bind(/*aristaInversa*/ ctx[0])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			create_component(flecha0.$$.fragment);
    			create_component(flecha1.$$.fragment);
    			create_component(peso0.$$.fragment);
    			create_component(peso1.$$.fragment);
    			attr_dev(line0, "class", line0_class_value = "" + (/*colores*/ ctx[6].coloresStroke.colorInverso + " stroke-2"));
    			attr_dev(line0, "x1", line0_x__value = /*posicionesArista*/ ctx[3].inicio.x);
    			attr_dev(line0, "y1", line0_y__value = /*posicionesArista*/ ctx[3].inicio.y);
    			attr_dev(line0, "x2", line0_x__value_1 = /*posicionesArista*/ ctx[3].puntoMedio.x);
    			attr_dev(line0, "y2", line0_y__value_1 = /*posicionesArista*/ ctx[3].puntoMedio.y);
    			add_location(line0, file$2, 229, 8, 8817);
    			attr_dev(line1, "class", line1_class_value = "" + (/*colores*/ ctx[6].coloresStroke.color + " stroke-2"));
    			attr_dev(line1, "x1", line1_x__value = /*posicionesArista*/ ctx[3].puntoMedio.x);
    			attr_dev(line1, "y1", line1_y__value = /*posicionesArista*/ ctx[3].puntoMedio.y);
    			attr_dev(line1, "x2", line1_x__value_1 = /*posicionesArista*/ ctx[3].final.x);
    			attr_dev(line1, "y2", line1_y__value_1 = /*posicionesArista*/ ctx[3].final.y);
    			add_location(line1, file$2, 238, 8, 9126);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line0, anchor);
    			insert_dev(target, line1, anchor);
    			mount_component(flecha0, target, anchor);
    			mount_component(flecha1, target, anchor);
    			mount_component(peso0, target, anchor);
    			mount_component(peso1, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(line0, "click", /*onClickArista*/ ctx[8], false, false, false),
    					listen_dev(line1, "click", /*onClickArista*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*colores*/ 64 && line0_class_value !== (line0_class_value = "" + (/*colores*/ ctx[6].coloresStroke.colorInverso + " stroke-2"))) {
    				attr_dev(line0, "class", line0_class_value);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line0_x__value !== (line0_x__value = /*posicionesArista*/ ctx[3].inicio.x)) {
    				attr_dev(line0, "x1", line0_x__value);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line0_y__value !== (line0_y__value = /*posicionesArista*/ ctx[3].inicio.y)) {
    				attr_dev(line0, "y1", line0_y__value);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line0_x__value_1 !== (line0_x__value_1 = /*posicionesArista*/ ctx[3].puntoMedio.x)) {
    				attr_dev(line0, "x2", line0_x__value_1);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line0_y__value_1 !== (line0_y__value_1 = /*posicionesArista*/ ctx[3].puntoMedio.y)) {
    				attr_dev(line0, "y2", line0_y__value_1);
    			}

    			if (!current || dirty & /*colores*/ 64 && line1_class_value !== (line1_class_value = "" + (/*colores*/ ctx[6].coloresStroke.color + " stroke-2"))) {
    				attr_dev(line1, "class", line1_class_value);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line1_x__value !== (line1_x__value = /*posicionesArista*/ ctx[3].puntoMedio.x)) {
    				attr_dev(line1, "x1", line1_x__value);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line1_y__value !== (line1_y__value = /*posicionesArista*/ ctx[3].puntoMedio.y)) {
    				attr_dev(line1, "y1", line1_y__value);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line1_x__value_1 !== (line1_x__value_1 = /*posicionesArista*/ ctx[3].final.x)) {
    				attr_dev(line1, "x2", line1_x__value_1);
    			}

    			if (!current || dirty & /*posicionesArista*/ 8 && line1_y__value_1 !== (line1_y__value_1 = /*posicionesArista*/ ctx[3].final.y)) {
    				attr_dev(line1, "y2", line1_y__value_1);
    			}

    			const flecha0_changes = {};
    			if (dirty & /*posicionesArista*/ 8) flecha0_changes.posicion = /*posicionesArista*/ ctx[3].inicio;
    			if (dirty & /*posicionesArista*/ 8) flecha0_changes.angulo = /*posicionesArista*/ ctx[3].angulo - Math.PI / 2;
    			if (dirty & /*colores*/ 64) flecha0_changes.fillColor = /*colores*/ ctx[6].coloresFill.colorInverso;
    			flecha0.$set(flecha0_changes);
    			const flecha1_changes = {};
    			if (dirty & /*posicionesArista*/ 8) flecha1_changes.posicion = /*posicionesArista*/ ctx[3].final;
    			if (dirty & /*posicionesArista*/ 8) flecha1_changes.angulo = /*posicionesArista*/ ctx[3].angulo + Math.PI / 2;
    			if (dirty & /*colores*/ 64) flecha1_changes.fillColor = /*colores*/ ctx[6].coloresFill.color;
    			flecha1.$set(flecha1_changes);
    			const peso0_changes = {};
    			if (dirty & /*posicionesPesos*/ 16) peso0_changes.posicion = /*posicionesPesos*/ ctx[4].posicionPeso;
    			if (dirty & /*arista*/ 2) peso0_changes.peso = /*arista*/ ctx[1].peso;
    			if (dirty & /*colores*/ 64) peso0_changes.bgColor = /*colores*/ ctx[6].coloresBG.color;
    			if (dirty & /*arista*/ 2) peso0_changes.cambiarPeso = /*arista*/ ctx[1].cambiarPeso.bind(/*arista*/ ctx[1]);
    			peso0.$set(peso0_changes);
    			const peso1_changes = {};
    			if (dirty & /*posicionesPesos*/ 16) peso1_changes.posicion = /*posicionesPesos*/ ctx[4].posicionPesoInverso;
    			if (dirty & /*aristaInversa*/ 1) peso1_changes.peso = /*aristaInversa*/ ctx[0].peso;
    			if (dirty & /*colores*/ 64) peso1_changes.bgColor = /*colores*/ ctx[6].coloresBG.colorInverso;
    			if (dirty & /*aristaInversa*/ 1) peso1_changes.cambiarPeso = /*aristaInversa*/ ctx[0].cambiarPeso.bind(/*aristaInversa*/ ctx[0]);
    			peso1.$set(peso1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flecha0.$$.fragment, local);
    			transition_in(flecha1.$$.fragment, local);
    			transition_in(peso0.$$.fragment, local);
    			transition_in(peso1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flecha0.$$.fragment, local);
    			transition_out(flecha1.$$.fragment, local);
    			transition_out(peso0.$$.fragment, local);
    			transition_out(peso1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line0);
    			if (detaching) detach_dev(line1);
    			destroy_component(flecha0, detaching);
    			destroy_component(flecha1, detaching);
    			destroy_component(peso0, detaching);
    			destroy_component(peso1, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(229:4) {#if aristaBidireccional}",
    		ctx
    	});

    	return block;
    }

    // (304:4) {#if arista && (arista.esCamino || arista.fueCamino)}
    function create_if_block_1$1(ctx) {
    	let peso;
    	let current;

    	peso = new Peso({
    			props: {
    				onClickArista: /*onClickArista*/ ctx[8],
    				posicion: {
    					x: /*posicionesFlujos*/ ctx[5].posicionFlujo.x,
    					y: /*posicionesFlujos*/ ctx[5].posicionFlujo.y
    				},
    				peso: /*arista*/ ctx[1].flujo,
    				bgColor: bgPesoFlujo,
    				textColor: "text-black",
    				dibujarCero: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(peso.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(peso, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const peso_changes = {};

    			if (dirty & /*posicionesFlujos*/ 32) peso_changes.posicion = {
    				x: /*posicionesFlujos*/ ctx[5].posicionFlujo.x,
    				y: /*posicionesFlujos*/ ctx[5].posicionFlujo.y
    			};

    			if (dirty & /*arista*/ 2) peso_changes.peso = /*arista*/ ctx[1].flujo;
    			peso.$set(peso_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(peso.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(peso.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(peso, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(304:4) {#if arista && (arista.esCamino || arista.fueCamino)}",
    		ctx
    	});

    	return block;
    }

    // (319:4) {#if aristaInversa && (aristaInversa.esCamino || aristaInversa.fueCamino)}
    function create_if_block$1(ctx) {
    	let peso;
    	let current;

    	peso = new Peso({
    			props: {
    				onClickArista: /*onClickArista*/ ctx[8],
    				posicion: {
    					x: /*posicionesFlujos*/ ctx[5].posicionFlujoInverso.x,
    					y: /*posicionesFlujos*/ ctx[5].posicionFlujoInverso.y
    				},
    				peso: /*aristaInversa*/ ctx[0].flujo,
    				bgColor: bgPesoFlujo,
    				textColor: "text-black",
    				dibujarCero: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(peso.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(peso, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const peso_changes = {};

    			if (dirty & /*posicionesFlujos*/ 32) peso_changes.posicion = {
    				x: /*posicionesFlujos*/ ctx[5].posicionFlujoInverso.x,
    				y: /*posicionesFlujos*/ ctx[5].posicionFlujoInverso.y
    			};

    			if (dirty & /*aristaInversa*/ 1) peso_changes.peso = /*aristaInversa*/ ctx[0].flujo;
    			peso.$set(peso_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(peso.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(peso.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(peso, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(319:4) {#if aristaInversa && (aristaInversa.esCamino || aristaInversa.fueCamino)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let svg;
    	let current_block_type_index;
    	let if_block0;
    	let if_block0_anchor;
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*aristaBidireccional*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*arista*/ ctx[1] && (/*arista*/ ctx[1].esCamino || /*arista*/ ctx[1].fueCamino) && create_if_block_1$1(ctx);
    	let if_block2 = /*aristaInversa*/ ctx[0] && (/*aristaInversa*/ ctx[0].esCamino || /*aristaInversa*/ ctx[0].fueCamino) && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			if (if_block2) if_block2.c();
    			add_location(svg, file$2, 227, 0, 8773);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if_blocks[current_block_type_index].m(svg, null);
    			append_dev(svg, if_block0_anchor);
    			if (if_block1) if_block1.m(svg, null);
    			append_dev(svg, if_block1_anchor);
    			if (if_block2) if_block2.m(svg, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(svg, if_block0_anchor);
    			}

    			if (/*arista*/ ctx[1] && (/*arista*/ ctx[1].esCamino || /*arista*/ ctx[1].fueCamino)) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*arista*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(svg, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*aristaInversa*/ ctx[0] && (/*aristaInversa*/ ctx[0].esCamino || /*aristaInversa*/ ctx[0].fueCamino)) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*aristaInversa*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(svg, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const bgPesoFlujo = "bg-yellow-300";

    function instance$2($$self, $$props, $$invalidate) {
    	let aristaBidireccional;
    	let aristaPrincipal;
    	let eliminandoArista;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arista', slots, []);
    	let { arista } = $$props;
    	let { aristaInversa } = $$props;
    	let prevEliminandoArista = eliminandoArista;
    	let posicionesArista;
    	let posicionesPesos;
    	let posicionesFlujos;
    	let colores;
    	let prevArista;
    	let prevAristaInversa;

    	function copiarValoresPrevArista() {
    		prevEliminandoArista = eliminandoArista;

    		if (arista) {
    			prevArista = {
    				origenPos: arista.origen.posicion,
    				destinoPos: arista.destino.posicion,
    				esCamino: arista.esCamino,
    				peso: arista.peso,
    				flujo: arista.flujo
    			};
    		}

    		if (aristaInversa) {
    			prevAristaInversa = {
    				origenPos: aristaInversa.origen.posicion,
    				destinoPos: aristaInversa.destino.posicion,
    				esCamino: aristaInversa.esCamino,
    				peso: aristaInversa.peso,
    				flujo: aristaInversa.flujo
    			};
    		}
    	}

    	const coloresStroke = {
    		"normal": "stroke-emerald-600",
    		"inverso": "stroke-blue-600",
    		"camino": "stroke-yellow-300",
    		"fueCamino": "stroke-gray-600",
    		"eliminando": "stroke-gray-700"
    	};

    	function calcularColoresStroke() {
    		let color = coloresStroke.normal;

    		let colorInverso = aristaBidireccional
    		? coloresStroke.inverso
    		: coloresStroke.normal;

    		if (arista && arista.esCamino) {
    			color = coloresStroke.camino;
    		}

    		if (aristaInversa && aristaInversa.esCamino) {
    			colorInverso = coloresStroke.camino;
    		}

    		if (arista && arista.fueCamino) {
    			color = coloresStroke.fueCamino;
    		}

    		if (aristaInversa && aristaInversa.fueCamino) {
    			colorInverso = coloresStroke.fueCamino;
    		}

    		if (eliminandoArista) {
    			color = coloresStroke.eliminando;
    			colorInverso = coloresStroke.eliminando;
    		}

    		return { color, colorInverso };
    	}

    	const coloresFill = {
    		"normal": "fill-emerald-600",
    		"inverso": "fill-blue-600",
    		"camino": "fill-yellow-300",
    		"fueCamino": "fill-gray-600",
    		"eliminando": "fill-gray-700"
    	};

    	function calcularColoresFill() {
    		let color = coloresFill.normal;

    		let colorInverso = aristaBidireccional
    		? coloresFill.inverso
    		: coloresFill.normal;

    		if (arista && arista.esCamino) {
    			color = coloresFill.camino;
    		}

    		if (aristaInversa && aristaInversa.esCamino) {
    			colorInverso = coloresFill.camino;
    		}

    		if (arista && arista.fueCamino) {
    			color = coloresFill.fueCamino;
    		}

    		if (aristaInversa && aristaInversa.fueCamino) {
    			colorInverso = coloresFill.fueCamino;
    		}

    		if (eliminandoArista) {
    			color = coloresFill.eliminando;
    			colorInverso = coloresFill.eliminando;
    		}

    		return { color, colorInverso };
    	}

    	const coloresBG = {
    		"normal": "bg-emerald-800",
    		"inverso": "bg-blue-600",
    		"eliminando": "bg-gray-700",
    		"flujo": "bg-orange-700",
    		"flujoCompleto": "bg-rose-700"
    	};

    	function calcularColoresBG() {
    		let color = coloresBG.normal;

    		let colorInverso = aristaBidireccional
    		? coloresBG.inverso
    		: coloresBG.normal;

    		if (arista && arista.flujo !== 0) {
    			color = coloresBG.flujo;
    		}

    		if (aristaInversa && aristaInversa.flujo !== 0) {
    			colorInverso = coloresBG.flujo;
    		}

    		if (arista && arista.flujo === arista.peso) {
    			color = coloresBG.flujoCompleto;
    		}

    		if (aristaInversa && aristaInversa.flujo === aristaInversa.peso) {
    			colorInverso = coloresBG.flujoCompleto;
    		}

    		if (eliminandoArista) {
    			color = coloresBG.eliminando;
    			colorInverso = coloresBG.eliminando;
    		}

    		return { color, colorInverso };
    	}

    	function calcularPosicionesArista() {
    		const posOrigen = aristaPrincipal.origen.posicion;
    		const posDestino = aristaPrincipal.destino.posicion;
    		const radioOrigen = aristaPrincipal.origen.radio;
    		const radioDestino = aristaPrincipal.destino.radio;
    		const angulo = Math.atan2(posDestino.y - posOrigen.y, posDestino.x - posOrigen.x);

    		const inicio = {
    			x: posOrigen.x + radioOrigen * Math.cos(angulo),
    			y: posOrigen.y + radioOrigen * Math.sin(angulo)
    		};

    		const final = {
    			x: posDestino.x - radioDestino * Math.cos(angulo),
    			y: posDestino.y - radioDestino * Math.sin(angulo)
    		};

    		const puntoMedio = {
    			x: (inicio.x + final.x) / 2,
    			y: (inicio.y + final.y) / 2
    		};

    		return { inicio, puntoMedio, final, angulo };
    	}

    	function calcularPosicionesPesos() {
    		if (aristaBidireccional) {
    			const distancia = 0.75;

    			const posicionPeso = {
    				x: posicionesArista.inicio.x + (posicionesArista.final.x - posicionesArista.inicio.x) * distancia,
    				y: posicionesArista.inicio.y + (posicionesArista.final.y - posicionesArista.inicio.y) * distancia
    			};

    			const posicionPesoInverso = {
    				x: posicionesArista.final.x - (posicionesArista.final.x - posicionesArista.inicio.x) * distancia,
    				y: posicionesArista.final.y - (posicionesArista.final.y - posicionesArista.inicio.y) * distancia
    			};

    			return { posicionPeso, posicionPesoInverso };
    		}

    		const puntoMedio = posicionesArista.puntoMedio;

    		return {
    			posicionPeso: puntoMedio,
    			posicionPesoInverso: puntoMedio
    		};
    	}

    	function calcularPosicionFlujos() {
    		const diametro = 20 * 2;

    		const posicionFlujo = {
    			x: posicionesPesos.posicionPeso.x + diametro * Math.cos(posicionesArista.angulo + Math.PI / 2),
    			y: posicionesPesos.posicionPeso.y + diametro * Math.sin(posicionesArista.angulo + Math.PI / 2)
    		};

    		const posicionFlujoInverso = {
    			x: posicionesPesos.posicionPesoInverso.x + diametro * Math.cos(posicionesArista.angulo + Math.PI / 2),
    			y: posicionesPesos.posicionPesoInverso.y + diametro * Math.sin(posicionesArista.angulo + Math.PI / 2)
    		};

    		return { posicionFlujo, posicionFlujoInverso };
    	}

    	function updateArista() {
    		$$invalidate(3, posicionesArista = calcularPosicionesArista());
    		$$invalidate(4, posicionesPesos = calcularPosicionesPesos());
    		$$invalidate(5, posicionesFlujos = calcularPosicionFlujos());
    		const coloresStroke = calcularColoresStroke();
    		const coloresFill = calcularColoresFill();
    		const coloresBG = calcularColoresBG();
    		$$invalidate(6, colores = { coloresStroke, coloresFill, coloresBG });
    	}

    	beforeUpdate(() => {
    		if (!prevArista && !prevAristaInversa) {
    			copiarValoresPrevArista();
    			updateArista();
    			return;
    		}

    		//actualizamos los valores de la arista representada
    		if (//si se inicia o finaliza la eliminacion de aristas
    		prevEliminandoArista && !eliminandoArista || !prevEliminandoArista && eliminandoArista || (//si se crea una arista
    		!prevArista && arista || !prevAristaInversa && aristaInversa) || (//si se elimina una arista
    		prevArista && !arista || prevAristaInversa && !aristaInversa) || //si se cambia algun peso
    		prevArista && arista && prevArista.peso !== arista.peso || prevAristaInversa && aristaInversa && prevAristaInversa.peso !== aristaInversa.peso || //si se cambia el flujo
    		prevArista && arista && prevArista.flujo !== arista.flujo || prevAristaInversa && aristaInversa && prevAristaInversa.flujo !== aristaInversa.flujo || //si cambia el estado de camino
    		prevArista && arista && prevArista.esCamino !== arista.esCamino || prevAristaInversa && aristaInversa && prevAristaInversa.esCamino !== aristaInversa.esCamino || //si cambia la posicion de un vertice
    		prevArista && arista && (prevArista.origenPos.x !== arista.origen.posicion.x || prevArista.origenPos.y !== arista.origen.posicion.y || prevArista.destinoPos.x !== arista.destino.posicion.x || prevArista.destinoPos.y !== arista.destino.posicion.y) || prevAristaInversa && aristaInversa && (prevAristaInversa.origenPos.x !== aristaInversa.origen.posicion.x || prevAristaInversa.origenPos.y !== aristaInversa.origen.posicion.y || prevAristaInversa.destinoPos.x !== aristaInversa.destino.posicion.x || prevAristaInversa.destinoPos.y !== aristaInversa.destino.posicion.y)) {
    			copiarValoresPrevArista();
    			updateArista();
    			return;
    		}
    	});

    	function onClickArista() {
    		if (eliminandoArista) {
    			if (arista) {
    				arista.eliminar();
    			}

    			if (aristaInversa) {
    				aristaInversa.eliminar();
    			}

    			aristaPrincipal.grafo.finalizarEliminacionArista();
    		}
    	}

    	const writable_props = ['arista', 'aristaInversa'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arista> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('arista' in $$props) $$invalidate(1, arista = $$props.arista);
    		if ('aristaInversa' in $$props) $$invalidate(0, aristaInversa = $$props.aristaInversa);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		Flecha,
    		Peso,
    		arista,
    		aristaInversa,
    		prevEliminandoArista,
    		posicionesArista,
    		posicionesPesos,
    		posicionesFlujos,
    		colores,
    		bgPesoFlujo,
    		prevArista,
    		prevAristaInversa,
    		copiarValoresPrevArista,
    		coloresStroke,
    		calcularColoresStroke,
    		coloresFill,
    		calcularColoresFill,
    		coloresBG,
    		calcularColoresBG,
    		calcularPosicionesArista,
    		calcularPosicionesPesos,
    		calcularPosicionFlujos,
    		updateArista,
    		onClickArista,
    		aristaPrincipal,
    		eliminandoArista,
    		aristaBidireccional
    	});

    	$$self.$inject_state = $$props => {
    		if ('arista' in $$props) $$invalidate(1, arista = $$props.arista);
    		if ('aristaInversa' in $$props) $$invalidate(0, aristaInversa = $$props.aristaInversa);
    		if ('prevEliminandoArista' in $$props) prevEliminandoArista = $$props.prevEliminandoArista;
    		if ('posicionesArista' in $$props) $$invalidate(3, posicionesArista = $$props.posicionesArista);
    		if ('posicionesPesos' in $$props) $$invalidate(4, posicionesPesos = $$props.posicionesPesos);
    		if ('posicionesFlujos' in $$props) $$invalidate(5, posicionesFlujos = $$props.posicionesFlujos);
    		if ('colores' in $$props) $$invalidate(6, colores = $$props.colores);
    		if ('prevArista' in $$props) prevArista = $$props.prevArista;
    		if ('prevAristaInversa' in $$props) prevAristaInversa = $$props.prevAristaInversa;
    		if ('aristaPrincipal' in $$props) $$invalidate(2, aristaPrincipal = $$props.aristaPrincipal);
    		if ('eliminandoArista' in $$props) eliminandoArista = $$props.eliminandoArista;
    		if ('aristaBidireccional' in $$props) $$invalidate(7, aristaBidireccional = $$props.aristaBidireccional);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*arista, aristaInversa*/ 3) {
    			$$invalidate(0, aristaInversa = arista === aristaInversa ? null : aristaInversa);
    		}

    		if ($$self.$$.dirty & /*arista, aristaInversa*/ 3) {
    			$$invalidate(7, aristaBidireccional = arista && aristaInversa);
    		}

    		if ($$self.$$.dirty & /*arista, aristaInversa*/ 3) {
    			$$invalidate(2, aristaPrincipal = arista || aristaInversa);
    		}

    		if ($$self.$$.dirty & /*aristaPrincipal*/ 4) {
    			eliminandoArista = aristaPrincipal.grafo.eliminandoArista;
    		}
    	};

    	return [
    		aristaInversa,
    		arista,
    		aristaPrincipal,
    		posicionesArista,
    		posicionesPesos,
    		posicionesFlujos,
    		colores,
    		aristaBidireccional,
    		onClickArista
    	];
    }

    class Arista extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { arista: 1, aristaInversa: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arista",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*arista*/ ctx[1] === undefined && !('arista' in props)) {
    			console.warn("<Arista> was created without expected prop 'arista'");
    		}

    		if (/*aristaInversa*/ ctx[0] === undefined && !('aristaInversa' in props)) {
    			console.warn("<Arista> was created without expected prop 'aristaInversa'");
    		}
    	}

    	get arista() {
    		throw new Error("<Arista>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set arista(value) {
    		throw new Error("<Arista>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aristaInversa() {
    		throw new Error("<Arista>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aristaInversa(value) {
    		throw new Error("<Arista>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Grafo/Grafo.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/components/Grafo/Grafo.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (46:20) {#if aristas[i][j] || aristas[j][i]}
    function create_if_block_1(ctx) {
    	let aristacomponent;
    	let current;

    	aristacomponent = new Arista({
    			props: {
    				arista: /*aristas*/ ctx[2][/*i*/ ctx[14]][/*j*/ ctx[16]],
    				aristaInversa: /*aristas*/ ctx[2][/*j*/ ctx[16]][/*i*/ ctx[14]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(aristacomponent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(aristacomponent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const aristacomponent_changes = {};
    			if (dirty & /*aristas*/ 4) aristacomponent_changes.arista = /*aristas*/ ctx[2][/*i*/ ctx[14]][/*j*/ ctx[16]];
    			if (dirty & /*aristas*/ 4) aristacomponent_changes.aristaInversa = /*aristas*/ ctx[2][/*j*/ ctx[16]][/*i*/ ctx[14]];
    			aristacomponent.$set(aristacomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aristacomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aristacomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(aristacomponent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(46:20) {#if aristas[i][j] || aristas[j][i]}",
    		ctx
    	});

    	return block;
    }

    // (45:16) {#each Array(i+1) as _, j}
    function create_each_block_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*aristas*/ ctx[2][/*i*/ ctx[14]][/*j*/ ctx[16]] || /*aristas*/ ctx[2][/*j*/ ctx[16]][/*i*/ ctx[14]]) && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*aristas*/ ctx[2][/*i*/ ctx[14]][/*j*/ ctx[16]] || /*aristas*/ ctx[2][/*j*/ ctx[16]][/*i*/ ctx[14]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*aristas*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(45:16) {#each Array(i+1) as _, j}",
    		ctx
    	});

    	return block;
    }

    // (44:12) {#each Array(aristas.length) as _, i}
    function create_each_block_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_2 = Array(/*i*/ ctx[14] + 1);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*aristas*/ 4) {
    				each_value_2 = Array(/*i*/ ctx[14] + 1);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(44:12) {#each Array(aristas.length) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (55:12) {#each vertices as vertice}
    function create_each_block(ctx) {
    	let verticecomponent;
    	let current;

    	verticecomponent = new Vertice({
    			props: { vertice: /*vertice*/ ctx[9] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(verticecomponent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(verticecomponent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const verticecomponent_changes = {};
    			if (dirty & /*vertices*/ 8) verticecomponent_changes.vertice = /*vertice*/ ctx[9];
    			verticecomponent.$set(verticecomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(verticecomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(verticecomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(verticecomponent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(55:12) {#each vertices as vertice}",
    		ctx
    	});

    	return block;
    }

    // (67:12) {#if consola}
    function create_if_block(ctx) {
    	let consolacomponent;
    	let current;

    	consolacomponent = new Consola({
    			props: { consola: /*consola*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(consolacomponent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(consolacomponent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const consolacomponent_changes = {};
    			if (dirty & /*consola*/ 16) consolacomponent_changes.consola = /*consola*/ ctx[4];
    			consolacomponent.$set(consolacomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(consolacomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(consolacomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(consolacomponent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(67:12) {#if consola}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let svg1;
    	let svg0;
    	let each0_anchor;
    	let foreignObject0;
    	let menu;
    	let foreignObject1;
    	let current;
    	let each_value_1 = Array(/*aristas*/ ctx[2].length);
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*vertices*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	menu = new Menu({
    			props: { grafo: /*grafo*/ ctx[5] },
    			$$inline: true
    		});

    	let if_block = /*consola*/ ctx[4] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg1 = svg_element("svg");
    			svg0 = svg_element("svg");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each0_anchor = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			foreignObject0 = svg_element("foreignObject");
    			create_component(menu.$$.fragment);
    			foreignObject1 = svg_element("foreignObject");
    			if (if_block) if_block.c();
    			attr_dev(svg0, "height", /*height*/ ctx[1]);
    			add_location(svg0, file$1, 42, 8, 1201);
    			attr_dev(foreignObject0, "width", "100%");
    			attr_dev(foreignObject0, "height", "40px");
    			add_location(foreignObject0, file$1, 59, 8, 1765);
    			attr_dev(foreignObject1, "width", "100%");
    			attr_dev(foreignObject1, "height", "100%");
    			attr_dev(foreignObject1, "class", "pointer-events-none");
    			add_location(foreignObject1, file$1, 65, 8, 1907);
    			attr_dev(svg1, "width", /*width*/ ctx[0]);
    			attr_dev(svg1, "height", /*height*/ ctx[1]);
    			attr_dev(svg1, "class", "select-none");
    			add_location(svg1, file$1, 39, 4, 1127);
    			add_location(div, file$1, 38, 0, 1117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg1);
    			append_dev(svg1, svg0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(svg0, null);
    			}

    			append_dev(svg0, each0_anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg0, null);
    			}

    			append_dev(svg1, foreignObject0);
    			mount_component(menu, foreignObject0, null);
    			append_dev(svg1, foreignObject1);
    			if (if_block) if_block.m(foreignObject1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Array, aristas*/ 4) {
    				each_value_1 = Array(/*aristas*/ ctx[2].length);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(svg0, each0_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*vertices*/ 8) {
    				each_value = /*vertices*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svg0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*height*/ 2) {
    				attr_dev(svg0, "height", /*height*/ ctx[1]);
    			}

    			const menu_changes = {};
    			if (dirty & /*grafo*/ 32) menu_changes.grafo = /*grafo*/ ctx[5];
    			menu.$set(menu_changes);

    			if (/*consola*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*consola*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(foreignObject1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1) {
    				attr_dev(svg1, "width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*height*/ 2) {
    				attr_dev(svg1, "height", /*height*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(menu.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(menu.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(menu);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grafo', slots, []);
    	let { width } = $$props;
    	let prevWidth = width;
    	let { height } = $$props;
    	let prevHeight = width;
    	let aristas = [];
    	let vertices = [];
    	let consola;
    	let grafo;

    	beforeUpdate(() => {
    		if (prevWidth != width || prevHeight != height) {
    			prevWidth = width;
    			prevHeight = height;
    			grafo.cambiarTamanio(width, height);
    		}
    	});

    	//esta funcion son necesarias para decirle a Svelte que re-renderice el componente
    	function recargarGrafo() {
    		if (!grafo) return;
    		$$invalidate(5, grafo);
    		if (grafo.consola) $$invalidate(4, consola = grafo.consola);
    		if (grafo.vertices) $$invalidate(3, vertices = grafo.vertices);
    		if (aristas) $$invalidate(2, aristas = grafo.aristas);
    	}

    	grafo = generarGrafoAlAzar(5, width, height, recargarGrafo);
    	recargarGrafo();
    	console.log(grafo.matrizAdyacencia);
    	const writable_props = ['width', 'height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Grafo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({
    		generarGrafoAlAzar,
    		Menu,
    		ConsolaComponent: Consola,
    		VerticeComponent: Vertice,
    		AristaComponent: Arista,
    		beforeUpdate,
    		width,
    		prevWidth,
    		height,
    		prevHeight,
    		aristas,
    		vertices,
    		consola,
    		grafo,
    		recargarGrafo
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('prevWidth' in $$props) prevWidth = $$props.prevWidth;
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('prevHeight' in $$props) prevHeight = $$props.prevHeight;
    		if ('aristas' in $$props) $$invalidate(2, aristas = $$props.aristas);
    		if ('vertices' in $$props) $$invalidate(3, vertices = $$props.vertices);
    		if ('consola' in $$props) $$invalidate(4, consola = $$props.consola);
    		if ('grafo' in $$props) $$invalidate(5, grafo = $$props.grafo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [width, height, aristas, vertices, consola, grafo];
    }

    class Grafo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { width: 0, height: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grafo",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console_1.warn("<Grafo> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console_1.warn("<Grafo> was created without expected prop 'height'");
    		}
    	}

    	get width() {
    		throw new Error("<Grafo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Grafo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Grafo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Grafo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */

    const { window: window_1 } = globals;
    const file = "src/App.svelte";

    // (11:0) <Modal styleWindow={{ width: '70rem', height: '40rem' }}>
    function create_default_slot(ctx) {
    	let main;
    	let grafo;
    	let current;

    	grafo = new Grafo({
    			props: {
    				width: /*innerWidth*/ ctx[1],
    				height: /*innerHeight*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(grafo.$$.fragment);
    			attr_dev(main, "class", "w-full h-full bg-stone-100 dark:bg-gray-800");
    			add_location(main, file, 11, 0, 369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(grafo, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grafo_changes = {};
    			if (dirty & /*innerWidth*/ 2) grafo_changes.width = /*innerWidth*/ ctx[1];
    			if (dirty & /*innerHeight*/ 1) grafo_changes.height = /*innerHeight*/ ctx[0];
    			grafo.$set(grafo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grafo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grafo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(grafo);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:0) <Modal styleWindow={{ width: '70rem', height: '40rem' }}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let tailwindcss;
    	let t;
    	let modal;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[2]);
    	tailwindcss = new Tailwindcss({ $$inline: true });

    	modal = new Modal({
    			props: {
    				styleWindow: { width: '70rem', height: '40rem' },
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tailwindcss.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "resize", /*onwindowresize*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, innerWidth, innerHeight*/ 11) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwindcss.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwindcss.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwindcss, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let innerWidth;
    	let innerHeight;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, innerWidth = window_1.innerWidth);
    		$$invalidate(0, innerHeight = window_1.innerHeight);
    	}

    	$$self.$capture_state = () => ({
    		Modal,
    		Tailwindcss,
    		Grafo,
    		innerHeight,
    		innerWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('innerHeight' in $$props) $$invalidate(0, innerHeight = $$props.innerHeight);
    		if ('innerWidth' in $$props) $$invalidate(1, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, innerWidth = window.innerWidth);
    	$$invalidate(0, innerHeight = window.innerHeight);
    	return [innerHeight, innerWidth, onwindowresize];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
