<template>
  <div>
    <label class="block text-sm font-medium mb-1">Select Dates</label>
    <v-date-picker
        v-model="proxy"
        is-range
        :min-date="new Date()"
        :disabled-dates="disabledDates"
        color="green"
    />

  </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            default: () => ({ start: null, end: null })
        },
        availableDates:  {
            type: Array,
            default: () => []
        },
        ownerChosenDates:  {
            type: Array,
            default: () => []
        }
    },
  computed: {
        disabledDates() {
            if (this.ownerChosenDates.length == 0) {

                const all = [];
                const today = new Date();

                for (let i = 0; i < 365; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                const iso = d.toISOString().split('T')[0];
                if (!this.availableDates.includes(iso)) {
                    all.push(new Date(iso));
                }
                }

                return all;
            }

            return this.ownerChosenDates.map(date => new Date(date));
        },
        // `proxy` is a computed property that creates a two‐way binding
        // between the parent’s `v-model` and this child component’s `value` prop.
        proxy: {
            // When the parent reads `v-model`, it actually reads `proxy`,
            // which returns the current `value` prop passed in.
            get() {
            return this.value;
            },
            // When the child wants to update the model (e.g. user selects a date),
            // it sets `proxy`, which emits an `input` event carrying `val`.
            // Vue’s `v-model` on a custom component listens for that `input` event
            // and updates the parent’s bound variable accordingly.
            set(val) {
            this.$emit('input', val);
            },
        }
    },
};
</script>
