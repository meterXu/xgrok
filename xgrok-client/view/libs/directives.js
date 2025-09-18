
export default {
    debounce: {
        beforeMount(el, binding) {
            const eventType = binding.arg || 'click';
            const debouncedHandler = ()=>{
                binding.value.debounce()()
            };
            el.addEventListener(eventType, debouncedHandler);
            el._debouncedHandler = debouncedHandler;
        },
        unmounted(el) {
            const eventType = (el._debouncedHandler && el._debouncedHandler.arg) || 'click';
            el.removeEventListener(eventType, el._debouncedHandler);
            delete el._debouncedHandler;
        },
    }
}