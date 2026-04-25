<style>
    body {
        font-family: Arial, sans-serif;
        background: #f5f7fb;
        margin: 0;
    }

    .majors-page {
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 24px;
        padding: 30px;
    }

    .sidebar,
    .card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 20px;
    }

    .sidebar input {
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ccc;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 18px;
    }

    .badge {
        background: #e8f0ff;
        padding: 6px 10px;
        border-radius: 20px;
        font-size: 13px;
        margin-right: 8px;
    }

    .card a {
        color: #2563eb;
        font-weight: bold;
    }

    .card {
        transition: 0.2s;
    }

    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 768px) {
        .majors-page {
            grid-template-columns: 1fr;
        }

        .grid {
            grid-template-columns: 1fr;
        }
    }
</style>

@php
$majors = [
[
'name' => 'Computer Science',
'category' => 'Technology',
'demand' => 'High',
'description' => 'Learn programming and software development.'
],
[
'name' => 'Business Administration',
'category' => 'Business',
'demand' => 'Medium',
'description' => 'Management and entrepreneurship.'
],
];
@endphp

<div class="majors-page">

    <!-- Sidebar -->
    <aside class="sidebar">
        <h3>Filters</h3>
        <input type="text" placeholder="Search...">
    </aside>

    <!-- Content -->
    <main>
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2>Majors</h2>

            <div>
                <button onclick="setGrid()">Grid</button>
                <button onclick="setList()">List</button>
            </div>
        </div>

        <div class="grid">
            @foreach($majors as $major)
            <x-major-card :major="$major" />
            @endforeach
        </div>
    </main>

</div>

<script>
    function setGrid() {
        document.querySelector('.grid').style.gridTemplateColumns = 'repeat(2, 1fr)';
    }

    function setList() {
        document.querySelector('.grid').style.gridTemplateColumns = '1fr';
    }
</script>