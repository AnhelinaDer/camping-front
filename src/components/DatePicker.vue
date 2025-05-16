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
        availableDates: Array
    },
  computed: {
        disabledDates() {
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
        },
        proxy: {
            get() {
            return this.value;
            },
            set(val) {
            this.$emit('input', val);
            }
        }
    },
};
</script>
